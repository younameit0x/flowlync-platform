'use client';'use client';'use client';



import { useState, useEffect } from 'react';

import { useUser } from '@auth0/nextjs-auth0/client';

import { useState, useEffect } from 'react';import { useState, useEffect } from 'react';

export default function SmartMatchingDashboard() {

  const { user, error: userError, isLoading: userLoading } = useUser();import { useUser } from '@auth0/nextjs-auth0/client';import { useUser } from '@auth0/nextjs-auth0/client';

  const [activeStep, setActiveStep] = useState('welcome');

  const [recommendations, setRecommendations] = useState([]);

  const [preferences, setPreferences] = useState(null);

  const [loading, setLoading] = useState(true);export default function SmartMatchingDashboard() {export default function SmartMatchingDashboard() {

  const [error, setError] = useState(null);

  const [userAnswers, setUserAnswers] = useState({});  const { user, error: userError, isLoading: userLoading } = useUser();  const { user, error: userError, isLoading: userLoading } = useUser();



  // Development mode - allows testing without authentication  const [activeStep, setActiveStep] = useState('welcome');  const [activeStep, setActiveStep] = useState('welcome');

  const isDev = process.env.NODE_ENV === 'development';

  const mockUser = { sub: 'dev-user-123' };  const [recommendations, setRecommendations] = useState([]);  const [recommendations, setRecommendations] = useState([]);

  const effectiveUser = user || (isDev ? mockUser : null);

  const [preferences, setPreferences] = useState(null);  const [preferences, setPreferences] = useState(null);

  useEffect(() => {

    if (effectiveUser) {  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

      fetchUserPreferences();

    } else if (!userLoading && !isDev) {  const [error, setError] = useState(null);  const [error, setError] = useState(null);

      setLoading(false);

    }  const [userAnswers, setUserAnswers] = useState({});  const [userAnswers, setUserAnswers] = useState({});

  }, [effectiveUser, userLoading]);

  const [showTooltip, setShowTooltip] = useState(null);

  const fetchRecommendations = async () => {

    try {  // Development mode - allows testing without authentication

      const response = await fetch(`/api/smart-matching/recommendations?user_id=${effectiveUser.sub}&limit=10`);

      const data = await response.json();  const isDev = process.env.NODE_ENV === 'development';  // Development mode - allows testing without authentication



      if (response.ok) {  const mockUser = { sub: 'dev-user-123' };  const isDev = process.env.NODE_ENV === 'development';

        setRecommendations(data.recommendations || []);

      } else {  const effectiveUser = user || (isDev ? mockUser : null);  const mockUser = { sub: 'dev-user-123' };

        setError(data.error || 'Failed to fetch recommendations');

      }  const effectiveUser = user || (isDev ? mockUser : null);

    } catch (err) {

      console.error('Error fetching recommendations:', err);  useEffect(() => {

      setError('Failed to fetch recommendations');

    }    if (effectiveUser) {  useEffect(() => {

  };

      fetchUserPreferences();    if (effectiveUser) {

  const fetchUserPreferences = async () => {

    try {    } else if (!userLoading && !isDev) {      fetchUserPreferences();

      const response = await fetch(`/api/smart-matching/user-preferences?user_id=${effectiveUser.sub}`);

      const data = await response.json();      setLoading(false);    } else if (!userLoading && !isDev) {



      if (response.ok && data.preferences) {    }      setLoading(false);

        setPreferences(data.preferences);

        setActiveStep('results');  }, [effectiveUser, userLoading]);    }

        fetchRecommendations();

      } else {  }, [effectiveUser, userLoading]);

        setActiveStep('welcome');

      }  const fetchRecommendations = async () => {

    } catch (err) {

      console.error('Error fetching preferences:', err);    try {  const fetchRecommendations = async () => {

      setActiveStep('welcome');

    } finally {      const response = await fetch(`/api/smart-matching/recommendations?user_id=${effectiveUser.sub}&limit=10`);    try {

      setLoading(false);

    }      const data = await response.json();      const response = await fetch(`/api/smart-matching/recommendations?user_id=${effectiveUser.sub}&limit=10`);

  };

      const data = await response.json();

  const saveUserAnswers = async () => {

    try {      if (response.ok) {

      const preferences = {

        user_id: effectiveUser.sub,        setRecommendations(data.recommendations || []);      if (response.ok) {

        preferred_categories: userAnswers.categories || [],

        preferred_jurisdictions: userAnswers.regions || [],      } else {        setRecommendations(data.recommendations || []);

        risk_tolerance: userAnswers.experience || 'beginner',

        budget_range: userAnswers.budget || { min: 0, max: 1000 },        setError(data.error || 'Failed to fetch recommendations');      } else {

        experience_level: userAnswers.experience || 'beginner',

        traffic_type: userAnswers.trafficType || 'organic',      }        setError(data.error || 'Failed to fetch recommendations');

        traffic_volume: userAnswers.trafficVolume || 'small'

      };    } catch (err) {      }



      const response = await fetch('/api/smart-matching/user-preferences', {      console.error('Error fetching recommendations:', err);    } catch (err) {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },      setError('Failed to fetch recommendations');      console.error('Error fetching recommendations:', err);

        body: JSON.stringify(preferences)

      });    }      setError('Failed to fetch recommendations');



      if (response.ok) {  };    }

        setPreferences(preferences);

        setActiveStep('results');  };

        fetchRecommendations();

      }  const fetchUserPreferences = async () => {

    } catch (err) {

      console.error('Error saving preferences:', err);    try {  const fetchUserPreferences = async () => {

    }

  };      const response = await fetch(`/api/smart-matching/user-preferences?user_id=${effectiveUser.sub}`);    try {



  if (userLoading || (loading && !isDev)) {      const data = await response.json();      const response = await fetch(`/api/smart-matching/user-preferences?user_id=${effectiveUser.sub}`);

    return (

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">      const data = await response.json();

        <div className="text-white text-xl">

          🧠 Preparing your AI-powered affiliate matching...      if (response.ok && data.preferences) {

        </div>

      </div>        setPreferences(data.preferences);      if (response.ok && data.preferences) {

    );

  }        setActiveStep('results');        setPreferences(data.preferences);



  if (!effectiveUser && !isDev) {        fetchRecommendations();        setActiveStep('results');

    return (

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">      } else {        fetchRecommendations();

        <div className="text-white text-center">

          <h1 className="text-4xl font-bold mb-4">🎯 Smart Affiliate Matching</h1>        setActiveStep('welcome');      } else {

          <p className="text-xl mb-8">Please sign in to access personalized casino affiliate recommendations</p>

          <button       }        setActiveStep('welcome');

            onClick={() => window.location.href = '/api/auth/login'}

            className="bg-white bg-opacity-20 border-2 border-white text-white px-6 py-3 rounded-xl text-lg hover:bg-opacity-30 transition-all"    } catch (err) {      }

          >

            Sign In to Continue      console.error('Error fetching preferences:', err);    } catch (err) {

          </button>

        </div>      setActiveStep('welcome');      console.error('Error fetching preferences:', err);

      </div>

    );    } finally {      setActiveStep('welcome');

  }

      setLoading(false);    } finally {

  // Welcome Step - Educational Introduction

  if (activeStep === 'welcome') {    }      setLoading(false);

    return (

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8">  };    }

        <div className="container mx-auto px-4 max-w-4xl">

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">  };

            <div className="text-center mb-8">

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">  const saveUserAnswers = async () => {

                🎯 Smart Affiliate Matching

              </h1>    try {  const saveUserAnswers = async () => {

              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>

              <p className="text-xl text-gray-700 leading-relaxed">      const preferences = {    try {

                Turn your website traffic into money with AI-powered casino affiliate recommendations

              </p>        user_id: effectiveUser.sub,      const preferences = {

            </div>

        preferred_categories: userAnswers.categories || [],        user_id: effectiveUser.sub,

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">🤔 New to Affiliate Marketing?</h2>        preferred_jurisdictions: userAnswers.regions || [],        preferred_categories: userAnswers.categories || [],

              <div className="space-y-4">

                <div className="flex items-start space-x-3">        risk_tolerance: userAnswers.experience || 'beginner',        preferred_jurisdictions: userAnswers.regions || [],

                  <span className="text-2xl">💰</span>

                  <div>        budget_range: userAnswers.budget || { min: 0, max: 1000 },        risk_tolerance: userAnswers.experience || 'beginner',

                    <h3 className="font-bold text-gray-800">What is Affiliate Marketing?</h3>

                    <p className="text-gray-600">You promote casinos on your website and earn money when visitors sign up and play. No upfront costs!</p>        experience_level: userAnswers.experience || 'beginner',        budget_range: userAnswers.budget || { min: 0, max: 1000 },

                  </div>

                </div>        traffic_type: userAnswers.trafficType || 'organic',        experience_level: userAnswers.experience || 'beginner',

                <div className="flex items-start space-x-3">

                  <span className="text-2xl">🎯</span>        traffic_volume: userAnswers.trafficVolume || 'small'        traffic_type: userAnswers.trafficType || 'organic',

                  <div>

                    <h3 className="font-bold text-gray-800">What is CPA?</h3>      };        traffic_volume: userAnswers.trafficVolume || 'small'

                    <p className="text-gray-600">Cost Per Action - You get paid a fixed amount (like €50-200) for each new player who deposits money.</p>

                  </div>      };

                </div>

                <div className="flex items-start space-x-3">      const response = await fetch('/api/smart-matching/user-preferences', {

                  <span className="text-2xl">🌍</span>

                  <div>        method: 'POST',      const response = await fetch('/api/smart-matching/user-preferences', {

                    <h3 className="font-bold text-gray-800">Geographic Targeting</h3>

                    <p className="text-gray-600">Different casinos pay better for different countries. Latvian, German, and Scandinavian traffic is very valuable!</p>        headers: { 'Content-Type': 'application/json' },        method: 'POST',

                  </div>

                </div>        body: JSON.stringify(preferences)        headers: { 'Content-Type': 'application/json' },

              </div>

            </div>      });        body: JSON.stringify(preferences)



            <div className="text-center">      });

              <button

                onClick={() => setActiveStep('questions')}      if (response.ok) {

                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"

              >        setPreferences(preferences);      if (response.ok) {

                🚀 Start Finding Perfect Matches

              </button>        setActiveStep('results');        setPreferences(preferences);

              <p className="text-gray-500 mt-4">Takes 2 minutes • Get personalized recommendations</p>

            </div>        fetchRecommendations();        setActiveStep('results');

          </div>

        </div>      }        fetchRecommendations();

      </div>

    );    } catch (err) {      }

  }

      console.error('Error saving preferences:', err);    } catch (err) {

  return <div>Page under construction...</div>;

}    }      console.error('Error saving preferences:', err);

  };    }

  };

  if (userLoading || (loading && !isDev)) {

    return (  // Educational tooltip component

      <div style={{  const Tooltip = ({ content, children }) => (

        minHeight: '100vh',    <div className="relative inline-block">

        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',      {children}

        display: 'flex',      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 w-64">

        alignItems: 'center',        {content}

        justifyContent: 'center'        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>

      }}>      </div>

        <div style={{ color: 'white', fontSize: '18px' }}>    </div>

          🧠 Preparing your AI-powered affiliate matching...  );

        </div>

      </div>  if (userLoading || (loading && !isDev)) {

    );    return (

  }      <div style={{

        minHeight: '100vh',

  if (!effectiveUser && !isDev) {        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

    return (        display: 'flex',

      <div style={{        alignItems: 'center',

        minHeight: '100vh',        justifyContent: 'center'

        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',      }}>

        display: 'flex',        <div style={{ color: 'white', fontSize: '18px' }}>

        alignItems: 'center',          � Preparing your AI-powered affiliate matching...

        justifyContent: 'center',        </div>

        flexDirection: 'column',      </div>

        padding: '20px'    );

      }}>  }

        <div style={{ color: 'white', textAlign: 'center' }}>

          <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🎯 Smart Affiliate Matching</h1>  if (!effectiveUser && !isDev) {

          <p style={{ fontSize: '18px', marginBottom: '30px' }}>    return (

            Please sign in to access personalized casino affiliate recommendations      <div style={{

          </p>        minHeight: '100vh',

          <button         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

            onClick={() => window.location.href = '/api/auth/login'}        display: 'flex',

            style={{        alignItems: 'center',

              background: 'rgba(255,255,255,0.2)',        justifyContent: 'center',

              border: '2px solid white',        flexDirection: 'column',

              color: 'white',        padding: '20px'

              padding: '12px 24px',      }}>

              borderRadius: '8px',        <div style={{ color: 'white', textAlign: 'center' }}>

              fontSize: '16px',          <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🎯 Smart Affiliate Matching</h1>

              cursor: 'pointer'          <p style={{ fontSize: '18px', marginBottom: '30px' }}>

            }}            Please sign in to access personalized casino affiliate recommendations

          >          </p>

            Sign In to Continue          <button 

          </button>            onClick={() => window.location.href = '/api/auth/login'}

        </div>            style={{

      </div>              background: 'rgba(255,255,255,0.2)',

    );              border: '2px solid white',

  }              color: 'white',

              padding: '12px 24px',

  // Welcome Step - Educational Introduction              borderRadius: '8px',

  if (activeStep === 'welcome') {              fontSize: '16px',

    return (              cursor: 'pointer'

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8">            }}

        <div className="container mx-auto px-4 max-w-4xl">          >

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">            Sign In to Continue

            <div className="text-center mb-8">          </button>

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">        </div>

                🎯 Smart Affiliate Matching      </div>

              </h1>    );

              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>  }

              <p className="text-xl text-gray-700 leading-relaxed">

                Turn your website traffic into money with AI-powered casino affiliate recommendations  // Welcome Step - Educational Introduction

              </p>  if (activeStep === 'welcome') {

            </div>    return (

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8">

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">        <div className="container mx-auto px-4 max-w-4xl">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">🤔 New to Affiliate Marketing?</h2>          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">

              <div className="space-y-4">            <div className="text-center mb-8">

                <div className="flex items-start space-x-3">              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">

                  <span className="text-2xl">💰</span>                🎯 Smart Affiliate Matching

                  <div>              </h1>

                    <h3 className="font-bold text-gray-800">What is Affiliate Marketing?</h3>              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>

                    <p className="text-gray-600">You promote casinos on your website and earn money when visitors sign up and play. No upfront costs!</p>              <p className="text-xl text-gray-700 leading-relaxed">

                  </div>                Turn your website traffic into money with AI-powered casino affiliate recommendations

                </div>              </p>

                <div className="flex items-start space-x-3">            </div>

                  <span className="text-2xl">🎯</span>

                  <div>            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">

                    <h3 className="font-bold text-gray-800">What is CPA?</h3>              <h2 className="text-2xl font-bold text-gray-800 mb-4">🤔 New to Affiliate Marketing?</h2>

                    <p className="text-gray-600">Cost Per Action - You get paid a fixed amount (like €50-200) for each new player who deposits money.</p>              <div className="space-y-4">

                  </div>                <div className="flex items-start space-x-3">

                </div>                  <span className="text-2xl">💰</span>

                <div className="flex items-start space-x-3">                  <div>

                  <span className="text-2xl">🌍</span>                    <h3 className="font-bold text-gray-800">What is Affiliate Marketing?</h3>

                  <div>                    <p className="text-gray-600">You promote casinos on your website and earn money when visitors sign up and play. No upfront costs!</p>

                    <h3 className="font-bold text-gray-800">Geographic Targeting</h3>                  </div>

                    <p className="text-gray-600">Different casinos pay better for different countries. Latvian, German, and Scandinavian traffic is very valuable!</p>                </div>

                  </div>                <div className="flex items-start space-x-3">

                </div>                  <span className="text-2xl">🎯</span>

              </div>                  <div>

            </div>                    <h3 className="font-bold text-gray-800">What is CPA?</h3>

                    <p className="text-gray-600">Cost Per Action - You get paid a fixed amount (like €50-200) for each new player who deposits money.</p>

            <div className="text-center">                  </div>

              <button                </div>

                onClick={() => setActiveStep('questions')}                <div className="flex items-start space-x-3">

                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"                  <span className="text-2xl">🌍</span>

              >                  <div>

                🚀 Start Finding Perfect Matches                    <h3 className="font-bold text-gray-800">Geographic Targeting</h3>

              </button>                    <p className="text-gray-600">Different casinos pay better for different countries. Latvian, German, and Scandinavian traffic is very valuable!</p>

              <p className="text-gray-500 mt-4">Takes 2 minutes • Get personalized recommendations</p>                  </div>

            </div>                </div>

          </div>              </div>

        </div>            </div>

      </div>

    );            <div className="text-center">

  }              <button

                onClick={() => setActiveStep('questions')}

  // Questions Step - Guided Data Collection                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"

  if (activeStep === 'questions') {              >

    return (                🚀 Start Finding Perfect Matches

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8">              </button>

        <div className="container mx-auto px-4 max-w-4xl">              <p className="text-gray-500 mt-4">Takes 2 minutes • Get personalized recommendations</p>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">            </div>

            <div className="mb-8">          </div>

              <div className="flex items-center justify-between mb-4">        </div>

                <h1 className="text-3xl font-bold text-gray-800">📝 Tell Us About Your Traffic</h1>      </div>

                <span className="text-sm text-gray-500">Step 1 of 1</span>    );

              </div>  }

              <div className="w-full bg-gray-200 rounded-full h-2">

                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-1/2"></div>  // Questions Step - Guided Data Collection

              </div>  if (activeStep === 'questions') {

            </div>    return (

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8">

            <div className="space-y-8">        <div className="container mx-auto px-4 max-w-4xl">

              {/* Question 1: Geographic Traffic */}          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">

              <div className="border-2 border-gray-200 rounded-2xl p-6">            <div className="mb-8">

                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">              <div className="flex items-center justify-between mb-4">

                  🌍 Where is your website traffic from?                <h1 className="text-3xl font-bold text-gray-800">📝 Tell Us About Your Traffic</h1>

                  <div className="group ml-2 relative">                <span className="text-sm text-gray-500">Step 1 of 1</span>

                    <span className="text-blue-500 cursor-help">ⓘ</span>              </div>

                    <div className="invisible group-hover:visible absolute z-10 bg-gray-900 text-white p-3 rounded-lg text-sm w-64 -mt-2 ml-4">              <div className="w-full bg-gray-200 rounded-full h-2">

                      Different countries have different payout rates. Nordic countries typically pay €100-300 per player!                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-1/2"></div>

                    </div>              </div>

                  </div>            </div>

                </h3>

                <div className="grid md:grid-cols-3 gap-4">            <div className="space-y-8">

                  {[              {/* Question 1: Geographic Traffic */}

                    { value: ['latvia'], label: '🇱🇻 Latvia', bonus: 'High Value!' },              <div className="border-2 border-gray-200 rounded-2xl p-6">

                    { value: ['germany'], label: '🇩🇪 Germany', bonus: 'Premium Market!' },                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">

                    { value: ['sweden', 'norway', 'denmark'], label: '🇸🇪 Scandinavia', bonus: 'Top Payouts!' },                  🌍 Where is your website traffic from?

                    { value: ['finland'], label: '🇫🇮 Finland', bonus: 'Excellent CPA!' },                  <div className="group ml-2">

                    { value: ['uk'], label: '🇬🇧 United Kingdom', bonus: 'High Volume!' },                    <span className="text-blue-500 cursor-help">ⓘ</span>

                    { value: ['other'], label: '🌐 Other/Mixed', bonus: 'Tell us more!' }                    <div className="invisible group-hover:visible absolute z-10 bg-gray-900 text-white p-3 rounded-lg text-sm w-64 -mt-2 ml-4">

                  ].map((option) => (                      Different countries have different payout rates. Nordic countries typically pay €100-300 per player!

                    <div                    </div>

                      key={option.value[0]}                  </div>

                      onClick={() => setUserAnswers({...userAnswers, regions: option.value})}                </h3>

                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${                <div className="grid md:grid-cols-3 gap-4">

                        userAnswers.regions?.includes(option.value[0])                   {[

                          ? 'border-blue-500 bg-blue-50'                     { value: ['latvia'], label: '🇱🇻 Latvia', bonus: 'High Value!' },

                          : 'border-gray-200 hover:border-blue-300'                    { value: ['germany'], label: '🇩🇪 Germany', bonus: 'Premium Market!' },

                      }`}                    { value: ['sweden', 'norway', 'denmark'], label: '🇸🇪 Scandinavia', bonus: 'Top Payouts!' },

                    >                    { value: ['finland'], label: '🇫🇮 Finland', bonus: 'Excellent CPA!' },

                      <div className="text-lg font-bold">{option.label}</div>                    { value: ['uk'], label: '🇬🇧 United Kingdom', bonus: 'High Volume!' },

                      <div className="text-sm text-green-600 font-medium">{option.bonus}</div>                    { value: ['other'], label: '🌐 Other/Mixed', bonus: 'Tell us more!' }

                    </div>                  ].map((option) => (

                  ))}                    <div

                </div>                      key={option.value[0]}

              </div>                      onClick={() => setUserAnswers({...userAnswers, regions: option.value})}

                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${

              {/* Question 2: Traffic Volume */}                        userAnswers.regions?.includes(option.value[0]) 

              <div className="border-2 border-gray-200 rounded-2xl p-6">                          ? 'border-blue-500 bg-blue-50' 

                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">                          : 'border-gray-200 hover:border-blue-300'

                  📊 How much traffic do you get monthly?                      }`}

                  <div className="group ml-2 relative">                    >

                    <span className="text-blue-500 cursor-help">ⓘ</span>                      <div className="text-lg font-bold">{option.label}</div>

                    <div className="invisible group-hover:visible absolute z-10 bg-gray-900 text-white p-3 rounded-lg text-sm w-64 -mt-2 ml-4">                      <div className="text-sm text-green-600 font-medium">{option.bonus}</div>

                      Even small traffic can be profitable! 1000 visitors from Latvia could earn you €500-2000/month.                    </div>

                    </div>                  ))}

                  </div>                </div>

                </h3>              </div>

                <div className="grid md:grid-cols-4 gap-4">

                  {[              {/* Question 2: Traffic Volume */}

                    { value: 'small', label: '🌱 Under 10K', desc: 'Perfect for starting!' },              <div className="border-2 border-gray-200 rounded-2xl p-6">

                    { value: 'medium', label: '📈 10K - 100K', desc: 'Great potential!' },                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">

                    { value: 'large', label: '🚀 100K - 1M', desc: 'High earning potential!' },                  📊 How much traffic do you get monthly?

                    { value: 'huge', label: '💎 1M+', desc: 'Premium partner status!' }                  <div className="group ml-2">

                  ].map((option) => (                    <span className="text-blue-500 cursor-help">ⓘ</span>

                    <div                    <div className="invisible group-hover:visible absolute z-10 bg-gray-900 text-white p-3 rounded-lg text-sm w-64 -mt-2 ml-4">

                      key={option.value}                      Even small traffic can be profitable! 1000 visitors from Latvia could earn you €500-2000/month.

                      onClick={() => setUserAnswers({...userAnswers, trafficVolume: option.value})}                    </div>

                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${                  </div>

                        userAnswers.trafficVolume === option.value                 </h3>

                          ? 'border-purple-500 bg-purple-50'                 <div className="grid md:grid-cols-4 gap-4">

                          : 'border-gray-200 hover:border-purple-300'                  {[

                      }`}                    { value: 'small', label: '🌱 Under 10K', desc: 'Perfect for starting!' },

                    >                    { value: 'medium', label: '📈 10K - 100K', desc: 'Great potential!' },

                      <div className="font-bold">{option.label}</div>                    { value: 'large', label: '🚀 100K - 1M', desc: 'High earning potential!' },

                      <div className="text-sm text-gray-600">{option.desc}</div>                    { value: 'huge', label: '💎 1M+', desc: 'Premium partner status!' }

                    </div>                  ].map((option) => (

                  ))}                    <div

                </div>                      key={option.value}

              </div>                      onClick={() => setUserAnswers({...userAnswers, trafficVolume: option.value})}

                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${

              {/* Question 3: Experience Level */}                        userAnswers.trafficVolume === option.value 

              <div className="border-2 border-gray-200 rounded-2xl p-6">                          ? 'border-purple-500 bg-purple-50' 

                <h3 className="text-xl font-bold text-gray-800 mb-4">🎓 Your affiliate marketing experience?</h3>                          : 'border-gray-200 hover:border-purple-300'

                <div className="grid md:grid-cols-3 gap-4">                      }`}

                  {[                    >

                    { value: 'beginner', label: '🌟 Complete Beginner', desc: 'We\'ll guide you step by step!' },                      <div className="font-bold">{option.label}</div>

                    { value: 'intermediate', label: '📚 Some Experience', desc: 'You know the basics' },                      <div className="text-sm text-gray-600">{option.desc}</div>

                    { value: 'advanced', label: '🏆 Expert Level', desc: 'You know what you\'re doing' }                    </div>

                  ].map((option) => (                  ))}

                    <div                </div>

                      key={option.value}              </div>

                      onClick={() => setUserAnswers({...userAnswers, experience: option.value})}

                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${              {/* Question 3: Experience Level */}

                        userAnswers.experience === option.value               <div className="border-2 border-gray-200 rounded-2xl p-6">

                          ? 'border-green-500 bg-green-50'                 <h3 className="text-xl font-bold text-gray-800 mb-4">🎓 Your affiliate marketing experience?</h3>

                          : 'border-gray-200 hover:border-green-300'                <div className="grid md:grid-cols-3 gap-4">

                      }`}                  {[

                    >                    { value: 'beginner', label: '🌟 Complete Beginner', desc: 'We\'ll guide you step by step!' },

                      <div className="font-bold">{option.label}</div>                    { value: 'intermediate', label: '📚 Some Experience', desc: 'You know the basics' },

                      <div className="text-sm text-gray-600">{option.desc}</div>                    { value: 'advanced', label: '🏆 Expert Level', desc: 'You know what you\'re doing' }

                    </div>                  ].map((option) => (

                  ))}                    <div

                </div>                      key={option.value}

              </div>                      onClick={() => setUserAnswers({...userAnswers, experience: option.value})}

                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${

              {/* Question 4: Preferred Casino Types */}                        userAnswers.experience === option.value 

              <div className="border-2 border-gray-200 rounded-2xl p-6">                          ? 'border-green-500 bg-green-50' 

                <h3 className="text-xl font-bold text-gray-800 mb-4">🎰 What types of gambling interest your audience?</h3>                          : 'border-gray-200 hover:border-green-300'

                <div className="grid md:grid-cols-2 gap-4">                      }`}

                  {[                    >

                    { value: 'casino', label: '🎲 Online Casino', desc: 'Slots, table games, live dealers' },                      <div className="font-bold">{option.label}</div>

                    { value: 'sportsbook', label: '⚽ Sports Betting', desc: 'Football, basketball, etc.' },                      <div className="text-sm text-gray-600">{option.desc}</div>

                    { value: 'poker', label: '🃏 Poker', desc: 'Texas Hold\'em, tournaments' },                    </div>

                    { value: 'all', label: '🌟 All Types', desc: 'Maximum opportunities' }                  ))}

                  ].map((option) => (                </div>

                    <div              </div>

                      key={option.value}

                      onClick={() => setUserAnswers({...userAnswers, categories: [option.value]})}              {/* Question 4: Preferred Casino Types */}

                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${              <div className="border-2 border-gray-200 rounded-2xl p-6">

                        userAnswers.categories?.includes(option.value)                 <h3 className="text-xl font-bold text-gray-800 mb-4">🎰 What types of gambling interest your audience?</h3>

                          ? 'border-orange-500 bg-orange-50'                 <div className="grid md:grid-cols-2 gap-4">

                          : 'border-gray-200 hover:border-orange-300'                  {[

                      }`}                    { value: 'casino', label: '🎲 Online Casino', desc: 'Slots, table games, live dealers' },

                    >                    { value: 'sportsbook', label: '⚽ Sports Betting', desc: 'Football, basketball, etc.' },

                      <div className="font-bold">{option.label}</div>                    { value: 'poker', label: '🃏 Poker', desc: 'Texas Hold\'em, tournaments' },

                      <div className="text-sm text-gray-600">{option.desc}</div>                    { value: 'all', label: '🌟 All Types', desc: 'Maximum opportunities' }

                    </div>                  ].map((option) => (

                  ))}                    <div

                </div>                      key={option.value}

              </div>                      onClick={() => setUserAnswers({...userAnswers, categories: [option.value]})}

            </div>                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${

                        userAnswers.categories?.includes(option.value) 

            <div className="mt-8 flex justify-between">                          ? 'border-orange-500 bg-orange-50' 

              <button                          : 'border-gray-200 hover:border-orange-300'

                onClick={() => setActiveStep('welcome')}                      }`}

                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"                    >

              >                      <div className="font-bold">{option.label}</div>

                ← Back                      <div className="text-sm text-gray-600">{option.desc}</div>

              </button>                    </div>

              <button                  ))}

                onClick={saveUserAnswers}                </div>

                disabled={!userAnswers.regions || !userAnswers.trafficVolume || !userAnswers.experience || !userAnswers.categories}              </div>

                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"            </div>

              >

                🎯 Get My Matches →            <div className="mt-8 flex justify-between">

              </button>              <button

            </div>                onClick={() => setActiveStep('welcome')}

          </div>                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"

        </div>              >

      </div>                ← Back

    );              </button>

  }              <button

                onClick={saveUserAnswers}

  // Results Step - Educational Recommendations                disabled={!userAnswers.regions || !userAnswers.trafficVolume || !userAnswers.experience || !userAnswers.categories}

  if (activeStep === 'results') {                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"

    return (              >

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8">                🎯 Get My Matches →

        <div className="container mx-auto px-4 max-w-6xl">              </button>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">            </div>

            <div className="text-center mb-8">          </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">        </div>

                🎉 Your Perfect Affiliate Matches!      </div>

              </h1>    );

              <p className="text-xl text-gray-700">  }

                Based on your traffic from {userAnswers.regions?.join(', ')} • {userAnswers.trafficVolume} monthly visitors

              </p>  // Results Step - Educational Recommendations

            </div>  if (activeStep === 'results') {

    return (

            {/* Educational Summary */}      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8">

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">        <div className="container mx-auto px-4 max-w-6xl">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 What This Means for You</h2>          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">

              <div className="grid md:grid-cols-3 gap-6">            <div className="text-center mb-8">

                <div className="text-center">              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">

                  <div className="text-3xl mb-2">💰</div>                🎉 Your Perfect Affiliate Matches!

                  <div className="font-bold text-gray-800">Estimated Monthly Earnings</div>              </h1>

                  <div className="text-2xl font-bold text-green-600">              <p className="text-xl text-gray-700">

                    €{userAnswers.trafficVolume === 'small' ? '200-800' :                 Based on your traffic from {userAnswers.regions?.join(', ')} • {userAnswers.trafficVolume} monthly visitors

                       userAnswers.trafficVolume === 'medium' ? '800-3000' :              </p>

                       userAnswers.trafficVolume === 'large' ? '3000-15000' : '15000+'}            </div>

                  </div>

                  <div className="text-sm text-gray-600">Based on your traffic volume</div>            {/* Educational Summary */}

                </div>            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">

                <div className="text-center">              <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 What This Means for You</h2>

                  <div className="text-3xl mb-2">🎯</div>              <div className="grid md:grid-cols-3 gap-6">

                  <div className="font-bold text-gray-800">Best Strategy</div>                <div className="text-center">

                  <div className="text-lg font-bold text-blue-600">                  <div className="text-3xl mb-2">💰</div>

                    {userAnswers.experience === 'beginner' ? 'CPA Deals' :                   <div className="font-bold text-gray-800">Estimated Monthly Earnings</div>

                     userAnswers.experience === 'intermediate' ? 'CPA + RevShare' : 'RevShare Focus'}                  <div className="text-2xl font-bold text-green-600">

                  </div>                    €{userAnswers.trafficVolume === 'small' ? '200-800' : 

                  <div className="text-sm text-gray-600">Recommended for your level</div>                       userAnswers.trafficVolume === 'medium' ? '800-3000' :

                </div>                       userAnswers.trafficVolume === 'large' ? '3000-15000' : '15000+'}

                <div className="text-center">                  </div>

                  <div className="text-3xl mb-2">⏱️</div>                  <div className="text-sm text-gray-600">Based on your traffic volume</div>

                  <div className="font-bold text-gray-800">Time to First Payment</div>                </div>

                  <div className="text-lg font-bold text-purple-600">2-4 weeks</div>                <div className="text-center">

                  <div className="text-sm text-gray-600">After first conversions</div>                  <div className="text-3xl mb-2">🎯</div>

                </div>                  <div className="font-bold text-gray-800">Best Strategy</div>

              </div>                  <div className="text-lg font-bold text-blue-600">

            </div>                    {userAnswers.experience === 'beginner' ? 'CPA Deals' : 

                     userAnswers.experience === 'intermediate' ? 'CPA + RevShare' : 'RevShare Focus'}

            {/* Recommendations List */}                  </div>

            <div className="space-y-6">                  <div className="text-sm text-gray-600">Recommended for your level</div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Your Top Matches</h2>                </div>

                              <div className="text-center">

              {loading ? (                  <div className="text-3xl mb-2">⏱️</div>

                <div className="text-center py-8">                  <div className="font-bold text-gray-800">Time to First Payment</div>

                  <div className="animate-spin text-4xl mb-4">🎯</div>                  <div className="text-lg font-bold text-purple-600">2-4 weeks</div>

                  <div className="text-lg text-gray-600">Finding your perfect matches...</div>                  <div className="text-sm text-gray-600">After first conversions</div>

                </div>                </div>

              ) : recommendations.length > 0 ? (              </div>

                recommendations.map((rec, index) => (            </div>

                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">

                    <div className="flex items-start justify-between mb-4">            {/* Recommendations List */}

                      <div className="flex items-center space-x-4">            <div className="space-y-6">

                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">              <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Your Top Matches</h2>

                          #{index + 1}              

                        </div>              {loading ? (

                        <div>                <div className="text-center py-8">

                          <h3 className="text-xl font-bold text-gray-800">{rec.affiliate_name}</h3>                  <div className="animate-spin text-4xl mb-4">🎯</div>

                          <p className="text-gray-600">promoting {rec.casino_name}</p>                  <div className="text-lg text-gray-600">Finding your perfect matches...</div>

                        </div>                </div>

                      </div>              ) : recommendations.length > 0 ? (

                      <div className="text-right">                recommendations.map((rec, index) => (

                        <div className="text-2xl font-bold text-green-600">€{rec.commission_rate * 4}</div>                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">

                        <div className="text-sm text-gray-600">per new player</div>                    <div className="flex items-start justify-between mb-4">

                      </div>                      <div className="flex items-center space-x-4">

                    </div>                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">

                          #{index + 1}

                    <div className="grid md:grid-cols-3 gap-4 mb-4">                        </div>

                      <div className="bg-blue-50 rounded-xl p-4">                        <div>

                        <div className="font-bold text-blue-800">Match Score</div>                          <h3 className="text-xl font-bold text-gray-800">{rec.affiliate_name}</h3>

                        <div className="text-2xl font-bold text-blue-600">{rec.confidence_score}%</div>                          <p className="text-gray-600">promoting {rec.casino_name}</p>

                        <div className="text-sm text-blue-600">Perfect for your traffic</div>                        </div>

                      </div>                      </div>

                      <div className="bg-green-50 rounded-xl p-4">                      <div className="text-right">

                        <div className="font-bold text-green-800">Commission Type</div>                        <div className="text-2xl font-bold text-green-600">€{rec.commission_rate * 4}</div>

                        <div className="text-lg font-bold text-green-600">                        <div className="text-sm text-gray-600">per new player</div>

                          {userAnswers.experience === 'beginner' ? 'CPA' : 'CPA + RevShare'}                      </div>

                        </div>                    </div>

                        <div className="text-sm text-green-600">

                          {userAnswers.experience === 'beginner' ? 'Fixed payment per player' : 'Fixed + percentage'}                    <div className="grid md:grid-cols-3 gap-4 mb-4">

                        </div>                      <div className="bg-blue-50 rounded-xl p-4">

                      </div>                        <div className="font-bold text-blue-800">Match Score</div>

                      <div className="bg-purple-50 rounded-xl p-4">                        <div className="text-2xl font-bold text-blue-600">{rec.confidence_score}%</div>

                        <div className="font-bold text-purple-800">Target Market</div>                        <div className="text-sm text-blue-600">Perfect for your traffic</div>

                        <div className="text-lg font-bold text-purple-600">{rec.casino_jurisdiction?.toUpperCase()}</div>                      </div>

                        <div className="text-sm text-purple-600">Licensed & regulated</div>                      <div className="bg-green-50 rounded-xl p-4">

                      </div>                        <div className="font-bold text-green-800">Commission Type</div>

                    </div>                        <div className="text-lg font-bold text-green-600">

                          {userAnswers.experience === 'beginner' ? 'CPA' : 'CPA + RevShare'}

                    <div className="mb-4">                        </div>

                      <h4 className="font-bold text-gray-800 mb-2">🤔 Why This Match is Perfect for You:</h4>                        <div className="text-sm text-green-600">

                      <ul className="space-y-1 text-gray-700">                          {userAnswers.experience === 'beginner' ? 'Fixed payment per player' : 'Fixed + percentage'}

                        <li>✅ Specializes in {rec.casino_category} content (matches your audience)</li>                        </div>

                        <li>✅ High conversion rates from {userAnswers.regions?.join(', ')} traffic</li>                      </div>

                        <li>✅ {userAnswers.experience === 'beginner' ? 'Beginner-friendly with support' : 'Advanced tools available'}</li>                      <div className="bg-purple-50 rounded-xl p-4">

                        <li>✅ Fast payments and reliable tracking</li>                        <div className="font-bold text-purple-800">Target Market</div>

                      </ul>                        <div className="text-lg font-bold text-purple-600">{rec.casino_jurisdiction?.toUpperCase()}</div>

                    </div>                        <div className="text-sm text-purple-600">Licensed & regulated</div>

                      </div>

                    {userAnswers.experience === 'beginner' && (                    </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">

                        <h4 className="font-bold text-yellow-800 mb-2">🎓 Getting Started Tips:</h4>                    <div className="mb-4">

                        <ul className="text-yellow-700 text-sm space-y-1">                      <h4 className="font-bold text-gray-800 mb-2">🤔 Why This Match is Perfect for You:</h4>

                          <li>• Add casino banner ads to your website</li>                      <ul className="space-y-1 text-gray-700">

                          <li>• Write honest reviews about the casino</li>                        <li>✅ Specializes in {rec.casino_category} content (matches your audience)</li>

                          <li>• Use your unique tracking link in all promotions</li>                        <li>✅ High conversion rates from {userAnswers.regions?.join(', ')} traffic</li>

                          <li>• Track your clicks and conversions weekly</li>                        <li>✅ {userAnswers.experience === 'beginner' ? 'Beginner-friendly with support' : 'Advanced tools available'}</li>

                        </ul>                        <li>✅ Fast payments and reliable tracking</li>

                      </div>                      </ul>

                    )}                    </div>



                    <div className="flex space-x-4">                    {userAnswers.experience === 'beginner' && (

                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">

                        📞 Contact {rec.affiliate_name}                        <h4 className="font-bold text-yellow-800 mb-2">🎓 Getting Started Tips:</h4>

                      </button>                        <ul className="text-yellow-700 text-sm space-y-1">

                      <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors">                          <li>• Add casino banner ads to your website</li>

                        📋 Learn More                          <li>• Write honest reviews about the casino</li>

                      </button>                          <li>• Use your unique tracking link in all promotions</li>

                    </div>                          <li>• Track your clicks and conversions weekly</li>

                  </div>                        </ul>

                ))                      </div>

              ) : (                    )}

                <div className="text-center py-8">

                  <div className="text-4xl mb-4">🔍</div>                    <div className="flex space-x-4">

                  <div className="text-lg text-gray-600 mb-4">No matches found yet</div>                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">

                  <button                         📞 Contact {rec.affiliate_name}

                    onClick={() => setActiveStep('questions')}                      </button>

                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"                      <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors">

                  >                        📋 Learn More

                    Update Your Preferences                      </button>

                  </button>                    </div>

                </div>                  </div>

              )}                ))

            </div>              ) : (

                <div className="text-center py-8">

            {/* Next Steps Section */}                  <div className="text-4xl mb-4">🔍</div>

            {recommendations.length > 0 && (                  <div className="text-lg text-gray-600 mb-4">No matches found yet</div>

              <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">                  <button 

                <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Your Next Steps</h2>                    onClick={() => setActiveStep('questions')}

                <div className="grid md:grid-cols-3 gap-6">                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"

                  <div className="text-center">                  >

                    <div className="text-2xl mb-2">1️⃣</div>                    Update Your Preferences

                    <div className="font-bold text-gray-800">Contact Affiliates</div>                  </button>

                    <div className="text-sm text-gray-600">Reach out to your top 2-3 matches</div>                </div>

                  </div>              )}

                  <div className="text-center">            </div>

                    <div className="text-2xl mb-2">2️⃣</div>

                    <div className="font-bold text-gray-800">Get Your Links</div>            {/* Next Steps Section */}

                    <div className="text-sm text-gray-600">Set up tracking and get promotional materials</div>            {recommendations.length > 0 && (

                  </div>              <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">

                  <div className="text-center">                <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Your Next Steps</h2>

                    <div className="text-2xl mb-2">3️⃣</div>                <div className="grid md:grid-cols-3 gap-6">

                    <div className="font-bold text-gray-800">Start Promoting</div>                  <div className="text-center">

                    <div className="text-sm text-gray-600">Add content to your website and track results</div>                    <div className="text-2xl mb-2">1️⃣</div>

                  </div>                    <div className="font-bold text-gray-800">Contact Affiliates</div>

                </div>                    <div className="text-sm text-gray-600">Reach out to your top 2-3 matches</div>

              </div>                  </div>

            )}                  <div className="text-center">

                    <div className="text-2xl mb-2">2️⃣</div>

            <div className="mt-8 text-center">                    <div className="font-bold text-gray-800">Get Your Links</div>

              <button                    <div className="text-sm text-gray-600">Set up tracking and get promotional materials</div>

                onClick={() => setActiveStep('questions')}                  </div>

                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors mr-4"                  <div className="text-center">

              >                    <div className="text-2xl mb-2">3️⃣</div>

                ← Update Preferences                    <div className="font-bold text-gray-800">Start Promoting</div>

              </button>                    <div className="text-sm text-gray-600">Add content to your website and track results</div>

              <button                  </div>

                onClick={fetchRecommendations}                </div>

                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"              </div>

              >            )}

                🔄 Refresh Matches

              </button>            <div className="mt-8 text-center">

            </div>              <button

          </div>                onClick={() => setActiveStep('questions')}

        </div>                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors mr-4"

      </div>              >

    );                ← Update Preferences

  }              </button>

              <button

  return null;                onClick={fetchRecommendations}

}                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Matches
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔐 Login Required</div>
          <div style={{ marginBottom: '24px' }}>Please log in to access Smart Matching AI</div>
          <a
            href="/api/auth/login"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            🔐 Login to Continue
          </a>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>❌ Authentication Error</div>
          <div>{userError.message}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔐 Access Required</div>
          <div>Please log in to access Smart Matching</div>
        </div>
      </div>
    );
  }

  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '12px 24px',
        background: activeTab === tab ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: activeTab === tab ? 'bold' : 'normal',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  const RecommendationCard = ({ rec }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {rec.affiliate_logo && (
              <img
                src={rec.affiliate_logo}
                alt={rec.affiliate_name}
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
            <div>
              <h3 style={{ margin: '0', fontSize: '18px', color: '#1a202c' }}>
                {rec.affiliate_name}
              </h3>
              <p style={{ margin: '4px 0 0 0', color: '#4a5568', fontSize: '14px' }}>
                ↔ {rec.casino_name}
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: rec.confidence_score >= 80 ? '#48bb78' : rec.confidence_score >= 60 ? '#ed8936' : '#f56565',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {rec.confidence_score}% Match
          </div>
          <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
            {rec.commission_rate}% Commission
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontSize: '14px', color: '#2d3748', marginBottom: '8px' }}>🎯 Why This Match:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {rec.reasoning?.slice(0, 3).map((reason, index) => (
            <span key={index} style={{
              background: '#edf2f7',
              color: '#4a5568',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {reason}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleRecommendationFeedback(rec.id, 1, true)}
          style={{
            background: '#48bb78',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          ✅ Accept
        </button>
        <button
          onClick={() => handleRecommendationFeedback(rec.id, -1, false)}
          style={{
            background: '#f56565',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          ❌ Reject
        </button>
        <button
          onClick={() => window.open(rec.affiliate_website, '_blank')}
          style={{
            background: '#4299e1',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          🔗 Visit
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🤖 Smart Matching AI
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
            AI-powered affiliate-casino pairing recommendations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <TabButton tab="recommendations" label="Recommendations" icon="🎯" />
          <TabButton tab="preferences" label="Preferences" icon="⚙️" />
          <TabButton tab="analytics" label="Analytics" icon="📊" />
        </div>

        {/* Content */}
        {activeTab === 'recommendations' && (
          <div>
            {!preferences ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
                <h2 style={{ color: '#2d3748', marginBottom: '16px' }}>
                  Set Up Your Preferences
                </h2>
                <p style={{ color: '#4a5568', marginBottom: '24px' }}>
                  Tell us about your preferences so we can generate personalized recommendations
                </p>
                <button
                  onClick={() => setActiveTab('preferences')}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Set Preferences →
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ color: '#2d3748', marginBottom: '8px' }}>
                    🎯 Your Recommendations ({recommendations.length})
                  </h2>
                  <p style={{ color: '#4a5568', margin: '0' }}>
                    AI-powered matches based on your preferences and market data
                  </p>
                </div>

                {error && (
                  <div style={{
                    background: '#fed7d7',
                    border: '1px solid #e53e3e',
                    color: '#c53030',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    {error}
                  </div>
                )}

                {recommendations.length === 0 ? (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤔</div>
                    <h3 style={{ color: '#2d3748', marginBottom: '8px' }}>
                      No Recommendations Yet
                    </h3>
                    <p style={{ color: '#4a5568' }}>
                      We're analyzing the market for the best matches. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {recommendations.map((rec, index) => (
                      <RecommendationCard key={index} rec={rec} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <UserPreferencesTab user={effectiveUser} preferences={preferences} onUpdate={fetchUserPreferences} />
        )}

        {activeTab === 'analytics' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ color: '#2d3748', marginBottom: '16px' }}>
              Analytics Dashboard
            </h2>
            <p style={{ color: '#4a5568' }}>
              Track your recommendation performance and insights (Coming Soon)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserPreferencesTab({ user, preferences, onUpdate }) {
  // Use effectiveUser (includes dev mode support)
  const effectiveUser = user || { sub: 'dev-user-123' };
  const [formData, setFormData] = useState({
    preferred_categories: preferences?.preferred_categories || [],
    preferred_jurisdictions: preferences?.preferred_jurisdictions || [],
    risk_tolerance: preferences?.risk_tolerance || 'medium',
    budget_range: preferences?.budget_range || { min: 10, max: 1000 },
    preferred_features: preferences?.preferred_features || [],
    experience_level: preferences?.experience_level || 'intermediate'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/smart-matching/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: effectiveUser.sub,
          ...formData
        }),
      });

      if (response.ok) {
        onUpdate();
        alert('Preferences saved successfully!');
      } else {
        alert('Failed to save preferences');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    }));
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ color: '#2d3748', marginBottom: '24px' }}>
        ⚙️ Your Preferences
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Preferred Categories (comma-separated)
          </label>
          <input
            type="text"
            value={formData.preferred_categories.join(', ')}
            onChange={(e) => handleArrayChange('preferred_categories', e.target.value)}
            placeholder="casino, sportsbook, poker"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Preferred Jurisdictions (comma-separated)
          </label>
          <input
            type="text"
            value={formData.preferred_jurisdictions.join(', ')}
            onChange={(e) => handleArrayChange('preferred_jurisdictions', e.target.value)}
            placeholder="malta, curacao, uk"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Risk Tolerance
          </label>
          <select
            value={formData.risk_tolerance}
            onChange={(e) => setFormData(prev => ({ ...prev, risk_tolerance: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
              Min Budget ($)
            </label>
            <input
              type="number"
              value={formData.budget_range.min}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                budget_range: { ...prev.budget_range, min: parseInt(e.target.value) || 0 }
              }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
              Max Budget ($)
            </label>
            <input
              type="number"
              value={formData.budget_range.max}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                budget_range: { ...prev.budget_range, max: parseInt(e.target.value) || 1000 }
              }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Experience Level
          </label>
          <select
            value={formData.experience_level}
            onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? '💾 Saving...' : '💾 Save Preferences'}
        </button>
      </form>
    </div>
  );
}
