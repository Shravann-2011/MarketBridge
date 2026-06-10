import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // ensure backend running here

export const runCampaign = async (query, product, onProgress = null) => {
  try {
    console.log('🚀 Sending request to backend:', { query, product });
    
    // Start progress tracking
    if (onProgress) {
      onProgress({ step: 1, agent: 'Creative Agent', status: 'Starting campaign analysis...' });
      
      // Simulate progress updates (since backend doesn't send real-time updates yet)
      setTimeout(() => onProgress({ step: 1, agent: 'Creative Agent', status: 'Running Creative Agent...' }), 500);
      setTimeout(() => onProgress({ step: 2, agent: 'Finance Agent', status: 'Running Finance Agent...' }), 2000);
      setTimeout(() => onProgress({ step: 3, agent: 'Inventory Agent', status: 'Running Inventory Agent...' }), 4000);
      setTimeout(() => onProgress({ step: 4, agent: 'Lead Agent', status: 'Running Lead Agent...' }), 6000);
    }

    const res = await axios.post(`${API_URL}/run_campaign`, { query, product });
    console.log('📡 Backend response:', res.data);

    // Final progress update
    if (onProgress) {
      onProgress({ step: 4, agent: 'Lead Agent', status: 'Campaign analysis complete!', completed: true });
    }

    // Backend returns { success: true, data: {...} }
    if (res.data.success) {
      console.log('✅ Campaign data received:', res.data.data);
      return res.data.data; // Return the actual campaign results
    } else {
      throw new Error(res.data.error || 'Campaign failed');
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    if (onProgress) {
      onProgress({ step: 0, agent: '', status: 'Campaign failed', error: true });
    }
    throw error;
  }
};

// Helper function for progress simulation
export const simulateProgress = (onProgress, duration = 8000) => {
  const steps = [
    { step: 1, agent: 'Creative Agent', status: 'Analyzing campaign strategy...', delay: 0 },
    { step: 2, agent: 'Finance Agent', status: 'Calculating budget allocation...', delay: duration * 0.25 },
    { step: 3, agent: 'Inventory Agent', status: 'Checking inventory levels...', delay: duration * 0.5 },
    { step: 4, agent: 'Lead Agent', status: 'Coordinating final analysis...', delay: duration * 0.75 },
  ];

  steps.forEach(({ step, agent, status, delay }) => {
    setTimeout(() => {
      onProgress({ step, agent, status, totalSteps: 4 });
    }, delay);
  });
};
