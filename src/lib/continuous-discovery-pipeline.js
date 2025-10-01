// ⚡ Continuous Discovery Pipeline
// Automated scheduling and orchestration of all data collection systems

require('dotenv').config({ path: require('path').join(__dirname, '../../.env.local') });

const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');

// Import our data collection systems
const { ComprehensiveDataCollector } = require('./comprehensive-data-collector');
const { AutomatedCasinoDiscovery } = require('./automated-casino-discovery');
const { AIAffiliateProgramDetector } = require('./ai-affiliate-detector');
const { GlobalRegionalCoverage } = require('./global-regional-coverage');
const { DataQualityVerification } = require('./data-quality-verification');

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class ContinuousDiscoveryPipeline {
  constructor() {
    this.isRunning = false;
    this.scheduledJobs = new Map();
    this.pipelineStats = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      lastExecution: null,
      nextScheduledExecution: null,
      averageExecutionTime: 0,
      dataPointsCollected: 0,
      systemHealth: 'healthy'
    };
    
    // Pipeline configuration
    this.config = {
      // Schedule patterns (cron format)
      schedules: {
        comprehensive_collection: '0 2 * * 0',      // Weekly at 2 AM Sunday
        automated_discovery: '0 */6 * * *',         // Every 6 hours
        ai_affiliate_detection: '0 4 * * *',        // Daily at 4 AM
        regional_coverage: '0 3 * * 1',             // Weekly at 3 AM Monday
        data_verification: '0 1 * * *',             // Daily at 1 AM
        incremental_updates: '*/30 * * * *',        // Every 30 minutes
        health_check: '*/15 * * * *'                // Every 15 minutes
      },
      
      // Execution priorities
      priorities: {
        health_check: 1,
        incremental_updates: 2,
        data_verification: 3,
        automated_discovery: 4,
        ai_affiliate_detection: 5,
        regional_coverage: 6,
        comprehensive_collection: 7
      },
      
      // Resource limits
      limits: {
        max_concurrent_jobs: 3,
        max_execution_time: 4 * 60 * 60 * 1000, // 4 hours
        memory_threshold: 0.9,
        cpu_threshold: 0.8
      },
      
      // Data thresholds for triggering actions
      thresholds: {
        new_casinos_for_ai_detection: 50,
        data_age_for_verification: 7 * 24 * 60 * 60 * 1000, // 7 days
        discovery_rate_minimum: 10, // casinos per day
        quality_score_minimum: 75
      }
    };
    
    // System modules
    this.modules = {
      comprehensiveCollector: new ComprehensiveDataCollector(),
      automatedDiscovery: new AutomatedCasinoDiscovery(),
      aiDetector: new AIAffiliateProgramDetector(),
      regionalCoverage: new GlobalRegionalCoverage(),
      dataVerification: new DataQualityVerification()
    };
    
    // Execution queue
    this.executionQueue = [];
    this.activeJobs = new Set();
    
    console.log('⚡ Continuous Discovery Pipeline initialized');
  }

  // 🚀 Start the continuous pipeline
  async startPipeline() {
    if (this.isRunning) {
      console.log('⚠️ Pipeline is already running');
      return;
    }

    console.log('🚀 Starting Continuous Discovery Pipeline...');
    console.log('===========================================');
    
    this.isRunning = true;
    
    // Schedule all jobs
    this.scheduleJobs();
    
    // Start monitoring and health checks
    this.startHealthMonitoring();
    
    // Log pipeline start
    await this.logPipelineEvent('pipeline_started', {
      config: this.config,
      modules_loaded: Object.keys(this.modules).length
    });
    
    console.log('✅ Continuous Discovery Pipeline is now running');
    console.log('📊 Monitoring dashboard available at /dashboard');
  }

  // 🛑 Stop the pipeline
  async stopPipeline() {
    if (!this.isRunning) {
      console.log('⚠️ Pipeline is not running');
      return;
    }

    console.log('🛑 Stopping Continuous Discovery Pipeline...');
    
    // Cancel all scheduled jobs
    for (const [jobId, task] of this.scheduledJobs) {
      task.stop();
      console.log(`📅 Cancelled scheduled job: ${jobId}`);
    }
    
    // Wait for active jobs to complete
    if (this.activeJobs.size > 0) {
      console.log(`⏳ Waiting for ${this.activeJobs.size} active jobs to complete...`);
      await this.waitForActiveJobs();
    }
    
    this.isRunning = false;
    
    await this.logPipelineEvent('pipeline_stopped', {
      total_executions: this.pipelineStats.totalExecutions,
      uptime: Date.now() - (new Date(this.pipelineStats.lastExecution).getTime() || Date.now())
    });
    
    console.log('✅ Continuous Discovery Pipeline stopped');
  }

  // 📅 Schedule all automated jobs
  scheduleJobs() {
    console.log('📅 Scheduling automated jobs...');
    
    // Comprehensive data collection (weekly)
    this.scheduledJobs.set('comprehensive_collection', 
      cron.schedule(this.config.schedules.comprehensive_collection, async () => {
        await this.executeJob('comprehensive_collection', async () => {
          console.log('🌍 Running comprehensive data collection...');
          return await this.modules.comprehensiveCollector.runComprehensiveCollection();
        });
      }, { scheduled: false })
    );
    
    // Automated casino discovery (every 6 hours)
    this.scheduledJobs.set('automated_discovery', 
      cron.schedule(this.config.schedules.automated_discovery, async () => {
        await this.executeJob('automated_discovery', async () => {
          console.log('🔍 Running automated casino discovery...');
          return await this.modules.automatedDiscovery.runAutomatedDiscovery();
        });
      }, { scheduled: false })
    );
    
    // AI affiliate program detection (daily)
    this.scheduledJobs.set('ai_affiliate_detection', 
      cron.schedule(this.config.schedules.ai_affiliate_detection, async () => {
        await this.executeJob('ai_affiliate_detection', async () => {
          console.log('🧠 Running AI affiliate program detection...');
          const newCasinos = await this.getUnprocessedCasinos();
          if (newCasinos.length >= this.config.thresholds.new_casinos_for_ai_detection) {
            return await this.modules.aiDetector.processCasinoBatch(newCasinos);
          }
          return { message: 'Insufficient new casinos for processing' };
        });
      }, { scheduled: false })
    );
    
    // Regional coverage scan (weekly)
    this.scheduledJobs.set('regional_coverage', 
      cron.schedule(this.config.schedules.regional_coverage, async () => {
        await this.executeJob('regional_coverage', async () => {
          console.log('🌍 Running global regional coverage scan...');
          return await this.modules.regionalCoverage.runGlobalRegionalScan();
        });
      }, { scheduled: false })
    );
    
    // Data quality verification (daily)
    this.scheduledJobs.set('data_verification', 
      cron.schedule(this.config.schedules.data_verification, async () => {
        await this.executeJob('data_verification', async () => {
          console.log('🔍 Running data quality verification...');
          const oldRecords = await this.getRecordsForVerification();
          if (oldRecords.length > 0) {
            return await this.modules.dataVerification.verifyDataQuality(oldRecords);
          }
          return { message: 'No records need verification' };
        });
      }, { scheduled: false })
    );
    
    // Incremental updates (every 30 minutes)
    this.scheduledJobs.set('incremental_updates', 
      cron.schedule(this.config.schedules.incremental_updates, async () => {
        await this.executeJob('incremental_updates', async () => {
          console.log('⚡ Running incremental updates...');
          return await this.runIncrementalUpdates();
        });
      }, { scheduled: false })
    );
    
    // Health check (every 15 minutes)
    this.scheduledJobs.set('health_check', 
      cron.schedule(this.config.schedules.health_check, async () => {
        await this.executeJob('health_check', async () => {
          return await this.performHealthCheck();
        });
      }, { scheduled: false })
    );
    
    // Start all scheduled jobs
    for (const [jobId, task] of this.scheduledJobs) {
      task.start();
      console.log(`✅ Scheduled job: ${jobId}`);
    }
    
    console.log(`📅 ${this.scheduledJobs.size} jobs scheduled successfully`);
  }

  // ⚡ Execute a job with proper error handling and monitoring
  async executeJob(jobId, jobFunction) {
    const jobStart = Date.now();
    const executionId = `${jobId}_${jobStart}`;
    
    try {
      // Check if we can run this job (resource limits)
      if (!await this.canExecuteJob(jobId)) {
        console.log(`⏸️ Job ${jobId} deferred due to resource constraints`);
        return;
      }
      
      console.log(`🚀 Starting job: ${jobId} (${executionId})`);
      this.activeJobs.add(executionId);
      
      // Execute the job
      const result = await Promise.race([
        jobFunction(),
        this.createTimeout(this.config.limits.max_execution_time)
      ]);
      
      const executionTime = Date.now() - jobStart;
      
      // Update statistics
      this.pipelineStats.totalExecutions++;
      this.pipelineStats.successfulExecutions++;
      this.pipelineStats.lastExecution = new Date().toISOString();
      this.updateAverageExecutionTime(executionTime);
      
      // Log successful execution
      await this.logJobExecution(jobId, executionId, 'success', {
        execution_time: executionTime,
        result_summary: this.summarizeResult(result)
      });
      
      console.log(`✅ Job completed: ${jobId} (${executionTime}ms)`);
      
    } catch (error) {
      const executionTime = Date.now() - jobStart;
      
      this.pipelineStats.totalExecutions++;
      this.pipelineStats.failedExecutions++;
      
      // Log failed execution
      await this.logJobExecution(jobId, executionId, 'failed', {
        execution_time: executionTime,
        error_message: error.message,
        error_stack: error.stack
      });
      
      console.error(`❌ Job failed: ${jobId} - ${error.message}`);
      
      // Handle critical errors
      if (this.isCriticalError(error)) {
        await this.handleCriticalError(jobId, error);
      }
      
    } finally {
      this.activeJobs.delete(executionId);
    }
  }

  // 🔍 Incremental updates - check for changes and update existing data
  async runIncrementalUpdates() {
    console.log('⚡ Running incremental updates...');
    
    const updates = {
      updated_casinos: 0,
      new_affiliate_programs: 0,
      verified_changes: 0,
      data_corrections: 0
    };
    
    try {
      // Check for website status changes
      const statusUpdates = await this.checkWebsiteStatusChanges();
      updates.updated_casinos += statusUpdates.length;
      
      // Verify recent affiliate program changes
      const programUpdates = await this.verifyRecentProgramChanges();
      updates.new_affiliate_programs += programUpdates.length;
      
      // Quick quality checks on recent data
      const qualityChecks = await this.performQuickQualityChecks();
      updates.data_corrections += qualityChecks.corrections;
      
      console.log('✅ Incremental updates completed:', updates);
      return updates;
      
    } catch (error) {
      console.error('❌ Incremental updates failed:', error.message);
      throw error;
    }
  }

  // 🏥 Health monitoring and system status
  async performHealthCheck() {
    const health = {
      timestamp: new Date().toISOString(),
      system_status: 'healthy',
      modules: {},
      metrics: {},
      alerts: []
    };
    
    try {
      // Check each module health
      for (const [moduleId, module] of Object.entries(this.modules)) {
        health.modules[moduleId] = {
          status: 'healthy',
          last_execution: this.getLastExecutionTime(moduleId),
          memory_usage: this.getModuleMemoryUsage(moduleId)
        };
      }
      
      // System metrics
      health.metrics = {
        active_jobs: this.activeJobs.size,
        total_executions: this.pipelineStats.totalExecutions,
        success_rate: this.calculateSuccessRate(),
        average_execution_time: this.pipelineStats.averageExecutionTime,
        data_points_collected: await this.getTotalDataPoints(),
        disk_usage: await this.getDiskUsage(),
        database_health: await this.checkDatabaseHealth()
      };
      
      // Check for alerts
      health.alerts = await this.checkForAlerts(health.metrics);
      
      // Update overall system status
      if (health.alerts.some(alert => alert.severity === 'critical')) {
        health.system_status = 'critical';
        this.pipelineStats.systemHealth = 'critical';
      } else if (health.alerts.some(alert => alert.severity === 'warning')) {
        health.system_status = 'warning';
        this.pipelineStats.systemHealth = 'warning';
      } else {
        this.pipelineStats.systemHealth = 'healthy';
      }
      
      // Store health check result
      await this.storeHealthCheck(health);
      
    } catch (error) {
      health.system_status = 'error';
      health.error = error.message;
      console.error('❌ Health check failed:', error.message);
    }
    
    return health;
  }

  // 📊 Data retrieval methods
  async getUnprocessedCasinos() {
    try {
      const { data, error } = await supabase
        .from('discovered_casinos')
        .select('*')
        .is('ai_processed', null)
        .limit(this.config.thresholds.new_casinos_for_ai_detection);
        
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('❌ Error fetching unprocessed casinos:', error.message);
      return [];
    }
  }

  async getRecordsForVerification() {
    try {
      const cutoffDate = new Date(Date.now() - this.config.thresholds.data_age_for_verification);
      
      const { data, error } = await supabase
        .from('discovered_casinos')
        .select('*')
        .lt('last_verified', cutoffDate.toISOString())
        .limit(100);
        
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('❌ Error fetching records for verification:', error.message);
      return [];
    }
  }

  async checkWebsiteStatusChanges() {
    // Simulate website status checking
    const changes = [];
    const sampleCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < sampleCount; i++) {
      changes.push({
        casino_id: `casino_${i}`,
        previous_status: 'active',
        current_status: Math.random() > 0.9 ? 'inactive' : 'active',
        change_detected: new Date().toISOString()
      });
    }
    
    return changes;
  }

  async verifyRecentProgramChanges() {
    // Simulate affiliate program verification
    const programs = [];
    const sampleCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < sampleCount; i++) {
      programs.push({
        program_id: `program_${i}`,
        commission_change: Math.random() > 0.5 ? '+5%' : '-2%',
        verified: true,
        verification_time: new Date().toISOString()
      });
    }
    
    return programs;
  }

  async performQuickQualityChecks() {
    // Simulate quick quality checks
    return {
      records_checked: Math.floor(Math.random() * 50) + 10,
      corrections: Math.floor(Math.random() * 5),
      accuracy_score: Math.floor(Math.random() * 20) + 80 // 80-100%
    };
  }

  // 🔧 Utility and monitoring methods
  async canExecuteJob(jobId) {
    // Check concurrent job limit
    if (this.activeJobs.size >= this.config.limits.max_concurrent_jobs) {
      return false;
    }
    
    // Check system resources (simplified)
    const memoryUsage = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal;
    if (memoryUsage > this.config.limits.memory_threshold) {
      return false;
    }
    
    return true;
  }

  createTimeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Job timeout')), ms);
    });
  }

  isCriticalError(error) {
    const criticalPatterns = [
      'ECONNREFUSED',
      'Database connection',
      'Out of memory',
      'Permission denied'
    ];
    
    return criticalPatterns.some(pattern => 
      error.message.includes(pattern)
    );
  }

  async handleCriticalError(jobId, error) {
    console.error(`🚨 Critical error in ${jobId}:`, error.message);
    
    // Log critical error
    await this.logPipelineEvent('critical_error', {
      job_id: jobId,
      error_message: error.message,
      error_stack: error.stack,
      system_state: await this.getSystemState()
    });
    
    // Could implement automatic recovery or alerts here
  }

  async waitForActiveJobs() {
    const timeout = 300000; // 5 minutes
    const start = Date.now();
    
    while (this.activeJobs.size > 0 && (Date.now() - start) < timeout) {
      await this.delay(1000);
    }
  }

  updateAverageExecutionTime(executionTime) {
    const totalExecutions = this.pipelineStats.totalExecutions;
    const currentAverage = this.pipelineStats.averageExecutionTime;
    
    this.pipelineStats.averageExecutionTime = 
      ((currentAverage * (totalExecutions - 1)) + executionTime) / totalExecutions;
  }

  calculateSuccessRate() {
    const total = this.pipelineStats.totalExecutions;
    const successful = this.pipelineStats.successfulExecutions;
    
    return total > 0 ? ((successful / total) * 100).toFixed(2) : 100;
  }

  summarizeResult(result) {
    if (!result) return 'No result';
    
    if (typeof result === 'object') {
      const keys = Object.keys(result);
      if (keys.includes('casinos')) {
        return `Found ${result.casinos?.length || 0} casinos`;
      }
      if (keys.includes('programs')) {
        return `Found ${result.programs?.length || 0} programs`;
      }
      return `Object with ${keys.length} properties`;
    }
    
    return String(result).substring(0, 100);
  }

  // Monitoring helper methods
  getLastExecutionTime(moduleId) {
    // Simulate last execution time
    return new Date(Date.now() - Math.random() * 86400000).toISOString();
  }

  getModuleMemoryUsage(moduleId) {
    // Simulate memory usage
    return Math.floor(Math.random() * 100) + 50; // 50-150 MB
  }

  async getTotalDataPoints() {
    try {
      const { count } = await supabase
        .from('discovered_casinos')
        .select('*', { count: 'exact', head: true });
        
      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  async getDiskUsage() {
    // Simulate disk usage
    return {
      used: Math.floor(Math.random() * 500) + 100, // 100-600 GB
      total: 1000, // 1 TB
      percentage: Math.floor(Math.random() * 60) + 10 // 10-70%
    };
  }

  async checkDatabaseHealth() {
    try {
      const start = Date.now();
      await supabase.from('discovered_casinos').select('id').limit(1);
      const responseTime = Date.now() - start;
      
      return {
        status: responseTime < 1000 ? 'healthy' : 'slow',
        response_time: responseTime,
        connections: Math.floor(Math.random() * 20) + 5 // 5-25 connections
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async checkForAlerts(metrics) {
    const alerts = [];
    
    // Check success rate
    if (parseFloat(metrics.success_rate) < 90) {
      alerts.push({
        type: 'low_success_rate',
        severity: 'warning',
        message: `Success rate is ${metrics.success_rate}%`,
        threshold: '90%'
      });
    }
    
    // Check execution time
    if (metrics.average_execution_time > 300000) { // 5 minutes
      alerts.push({
        type: 'slow_execution',
        severity: 'warning',
        message: 'Average execution time is too high',
        value: `${metrics.average_execution_time}ms`
      });
    }
    
    // Check disk usage
    if (metrics.disk_usage.percentage > 80) {
      alerts.push({
        type: 'high_disk_usage',
        severity: 'critical',
        message: `Disk usage is ${metrics.disk_usage.percentage}%`,
        threshold: '80%'
      });
    }
    
    return alerts;
  }

  async getSystemState() {
    return {
      active_jobs: Array.from(this.activeJobs),
      memory_usage: process.memoryUsage(),
      uptime: process.uptime(),
      node_version: process.version
    };
  }

  // 💾 Logging and storage methods
  async logPipelineEvent(eventType, eventData) {
    try {
      await supabase
        .from('pipeline_events')
        .insert({
          event_type: eventType,
          event_data: eventData,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('❌ Failed to log pipeline event:', error.message);
    }
  }

  async logJobExecution(jobId, executionId, status, details) {
    try {
      await supabase
        .from('job_executions')
        .insert({
          job_id: jobId,
          execution_id: executionId,
          status: status,
          details: details,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('❌ Failed to log job execution:', error.message);
    }
  }

  async storeHealthCheck(health) {
    try {
      await supabase
        .from('system_health_checks')
        .insert(health);
    } catch (error) {
      console.error('❌ Failed to store health check:', error.message);
    }
  }

  startHealthMonitoring() {
    // Additional real-time monitoring could be implemented here
    console.log('💓 Health monitoring started');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 📊 Status and statistics methods
  getPipelineStatus() {
    return {
      is_running: this.isRunning,
      stats: this.pipelineStats,
      active_jobs: Array.from(this.activeJobs),
      scheduled_jobs: Array.from(this.scheduledJobs.keys()),
      next_executions: this.getNextExecutions()
    };
  }

  getNextExecutions() {
    // Simulate next execution times
    const now = new Date();
    const executions = {};
    
    Object.keys(this.config.schedules).forEach(jobId => {
      const nextTime = new Date(now.getTime() + Math.random() * 86400000); // Random within 24h
      executions[jobId] = nextTime.toISOString();
    });
    
    return executions;
  }

  // 🎮 Manual execution methods for testing/debugging
  async runJob(jobId) {
    if (!this.modules[jobId] && !this.config.schedules[jobId]) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    console.log(`🎮 Manually executing job: ${jobId}`);
    
    switch (jobId) {
      case 'comprehensive_collection':
        return await this.modules.comprehensiveCollector.runComprehensiveCollection();
      case 'automated_discovery':
        return await this.modules.automatedDiscovery.runAutomatedDiscovery();
      case 'ai_affiliate_detection':
        const casinos = await this.getUnprocessedCasinos();
        return await this.modules.aiDetector.processCasinoBatch(casinos);
      case 'regional_coverage':
        return await this.modules.regionalCoverage.runGlobalRegionalScan();
      case 'data_verification':
        const records = await this.getRecordsForVerification();
        return await this.modules.dataVerification.verifyDataQuality(records);
      case 'health_check':
        return await this.performHealthCheck();
      default:
        throw new Error(`Manual execution not implemented for ${jobId}`);
    }
  }
}

// Export for use in other modules
module.exports = { ContinuousDiscoveryPipeline };

// Development test run
if (require.main === module) {
  async function testContinuousPipeline() {
    console.log('🧪 Testing Continuous Discovery Pipeline...');
    
    const pipeline = new ContinuousDiscoveryPipeline();
    
    // Test manual job execution
    console.log('📊 Running health check...');
    const healthResult = await pipeline.runJob('health_check');
    console.log('Health Check Result:', healthResult);
    
    // Test pipeline status
    console.log('📊 Pipeline Status:', pipeline.getPipelineStatus());
    
    console.log('✅ Continuous pipeline test complete!');
  }
  
  testContinuousPipeline().catch(console.error);
}