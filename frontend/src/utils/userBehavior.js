/**
 * User Behavior Tracking & Personalization Engine
 * 
 * Tracks user interactions (views, downloads, likes, time spent)
 * and provides personalized content recommendations based on behavior.
 * All data stored in localStorage — no server dependency.
 */

const STORAGE_KEY = 'user_behavior_data';
const MAX_HISTORY = 200;

// ─── Helpers ────────────────────────────────────────────────
const getBehaviorData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch {
    return getDefaultData();
  }
};

const saveBehaviorData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full — trim old entries
    data.viewHistory = data.viewHistory.slice(-50);
    data.downloadHistory = data.downloadHistory.slice(-30);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }
};

const getDefaultData = () => ({
  // Category affinity scores (0-100)
  categoryScores: {},
  // Device preference
  devicePreference: null,
  // Recent view history  [{id, category, deviceType, timestamp}]
  viewHistory: [],
  // Download history
  downloadHistory: [],
  // Like history
  likeHistory: [],
  // Session data
  sessions: {
    totalVisits: 0,
    lastVisit: null,
    avgTimeSpent: 0,
    pagesViewed: 0,
    currentSessionStart: null,
    longestSession: 0
  },
  // Search history
  searchHistory: [],
  // Time-of-day preference
  timeOfDayPreference: {},
  // Engagement metrics
  engagement: {
    streakDays: 0,
    lastActiveDate: null,
    achievements: [],
    totalTimeSpent: 0,
    interactionCount: 0,
    favoriteHour: null,
    discoveryScore: 0
  },
  // Content discovery
  discovery: {
    categoriesExplored: [],
    unexploredCategories: [],
    recommendedItems: [],
    lastRefreshed: null
  },
  // Created timestamp
  createdAt: Date.now()
});

// ─── Score Weights ──────────────────────────────────────────
const WEIGHTS = {
  view: 1,
  download: 5,
  like: 3,
  search: 2,
  timeSpent: 0.5,    // per second
  recency: 0.95      // decay factor per day
};

// ─── Tracking Functions ─────────────────────────────────────

/**
 * Track a wallpaper/photo view
 */
export const trackView = (item) => {
  if (!item?._id) return;
  const data = getBehaviorData();
  
  // Add to view history
  data.viewHistory.push({
    id: item._id,
    category: item.category,
    deviceType: item.deviceType,
    timestamp: Date.now()
  });
  
  // Trim history
  if (data.viewHistory.length > MAX_HISTORY) {
    data.viewHistory = data.viewHistory.slice(-MAX_HISTORY);
  }
  
  // Update category score
  if (item.category) {
    data.categoryScores[item.category] = (data.categoryScores[item.category] || 0) + WEIGHTS.view;
  }
  
  // Track device preference
  if (item.deviceType && item.deviceType !== 'both') {
    data.devicePreference = item.deviceType;
  }
  
  // Track time of day
  const hour = new Date().getHours();
  const period = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  data.timeOfDayPreference[period] = (data.timeOfDayPreference[period] || 0) + 1;
  
  data.sessions.pagesViewed++;
  saveBehaviorData(data);
};

/**
 * Track a download
 */
export const trackDownload = (item) => {
  if (!item?._id) return;
  const data = getBehaviorData();
  
  data.downloadHistory.push({
    id: item._id,
    category: item.category,
    deviceType: item.deviceType,
    timestamp: Date.now()
  });
  
  if (data.downloadHistory.length > 100) {
    data.downloadHistory = data.downloadHistory.slice(-100);
  }
  
  // Downloads weight much more than views
  if (item.category) {
    data.categoryScores[item.category] = (data.categoryScores[item.category] || 0) + WEIGHTS.download;
  }
  
  saveBehaviorData(data);
};

/**
 * Track a like
 */
export const trackLike = (item) => {
  if (!item?._id) return;
  const data = getBehaviorData();
  
  data.likeHistory.push({
    id: item._id,
    category: item.category,
    timestamp: Date.now()
  });
  
  if (item.category) {
    data.categoryScores[item.category] = (data.categoryScores[item.category] || 0) + WEIGHTS.like;
  }
  
  saveBehaviorData(data);
};

/**
 * Track a search query
 */
export const trackSearch = (query) => {
  if (!query?.trim()) return;
  const data = getBehaviorData();
  
  data.searchHistory.push({
    query: query.trim().toLowerCase(),
    timestamp: Date.now()
  });
  
  if (data.searchHistory.length > 50) {
    data.searchHistory = data.searchHistory.slice(-50);
  }
  
  saveBehaviorData(data);
};

/**
 * Record session start
 */
export const trackSessionStart = () => {
  const data = getBehaviorData();
  data.sessions.totalVisits++;
  data.sessions.lastVisit = Date.now();
  saveBehaviorData(data);
};

// ─── Recommendation Functions ───────────────────────────────

/**
 * Get the user's top preferred categories, ranked by weighted score with recency decay
 * @returns {Array<{category: string, score: number}>} sorted from highest to lowest
 */
export const getPreferredCategories = () => {
  const data = getBehaviorData();
  const scores = { ...data.categoryScores };
  
  // Apply recency decay: recent views count more
  const now = Date.now();
  const dayMs = 86400000;
  
  data.viewHistory.forEach(v => {
    const daysAgo = (now - v.timestamp) / dayMs;
    const decayedWeight = WEIGHTS.view * Math.pow(WEIGHTS.recency, daysAgo);
    if (v.category) {
      scores[v.category] = (scores[v.category] || 0) + decayedWeight;
    }
  });
  
  data.downloadHistory.forEach(d => {
    const daysAgo = (now - d.timestamp) / dayMs;
    const decayedWeight = WEIGHTS.download * Math.pow(WEIGHTS.recency, daysAgo);
    if (d.category) {
      scores[d.category] = (scores[d.category] || 0) + decayedWeight;
    }
  });
  
  return Object.entries(scores)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
};

/**
 * Get the preferred device type for the user
 * @returns {'desktop'|'mobile'|null}
 */
export const getPreferredDevice = () => {
  const data = getBehaviorData();
  return data.devicePreference;
};

/**
 * Get personalized sort parameter for API calls
 * Returns 'trending' for new users, 'personalized' for returning users
 */
export const getPersonalizedSort = () => {
  const data = getBehaviorData();
  const hasHistory = data.viewHistory.length > 5 || data.downloadHistory.length > 0;
  return hasHistory ? 'personalized' : 'trending';
};

/**
 * Get the recommended category order based on user preferences
 * Puts preferred categories first, then remaining in default order
 * @param {Array} defaultCategories - array of {id, name, ...}
 * @returns {Array} reordered categories
 */
export const getRecommendedCategoryOrder = (defaultCategories) => {
  const preferred = getPreferredCategories();
  if (preferred.length === 0) return defaultCategories;
  
  const preferredIds = preferred.map(p => p.category);
  const reordered = [];
  
  // Always keep 'all' first
  const allCat = defaultCategories.find(c => c.id === 'all');
  if (allCat) reordered.push(allCat);
  
  // Add preferred categories in order
  preferredIds.forEach(catId => {
    const cat = defaultCategories.find(c => c.id === catId);
    if (cat && cat.id !== 'all') reordered.push(cat);
  });
  
  // Add remaining categories
  defaultCategories.forEach(cat => {
    if (!reordered.find(r => r.id === cat.id)) {
      reordered.push(cat);
    }
  });
  
  return reordered;
};

/**
 * Score and re-rank wallpapers/photos based on user preferences
 * @param {Array} items - array of wallpaper/photo objects
 * @returns {Array} re-ranked items with personalization score
 */
export const personalizeResults = (items) => {
  const data = getBehaviorData();
  const preferred = getPreferredCategories();
  const preferredMap = {};
  preferred.forEach((p, i) => { preferredMap[p.category] = p.score; });
  
  const maxScore = preferred.length > 0 ? preferred[0].score : 1;
  const viewedIds = new Set(data.viewHistory.map(v => v.id));
  const downloadedIds = new Set(data.downloadHistory.map(d => d.id));
  
  return items.map(item => {
    let personalScore = 0;
    
    // Category preference boost
    if (item.category && preferredMap[item.category]) {
      personalScore += (preferredMap[item.category] / maxScore) * 50;
    }
    
    // Popularity boost (downloads & likes)
    personalScore += Math.min((item.downloads || 0) * 0.3, 20);
    personalScore += Math.min((item.likes || 0) * 0.5, 15);
    
    // Novelty: boost items NOT yet viewed
    if (!viewedIds.has(item._id)) {
      personalScore += 10;
    }
    
    // Previously downloaded items get slight penalty (encourage discovery)
    if (downloadedIds.has(item._id)) {
      personalScore -= 5;
    }
    
    // Device match bonus
    if (data.devicePreference && item.deviceType === data.devicePreference) {
      personalScore += 8;
    }
    
    return { ...item, _personalScore: personalScore };
  }).sort((a, b) => b._personalScore - a._personalScore);
};

/**
 * Check if user is a returning visitor (has behavior history)
 * @returns {boolean}
 */
export const isReturningUser = () => {
  const data = getBehaviorData();
  return data.sessions.totalVisits > 1 || data.viewHistory.length > 3;
};

/**
 * Get engagement summary for display
 * @returns {object}
 */
export const getEngagementSummary = () => {
  const data = getBehaviorData();
  const preferred = getPreferredCategories();
  
  return {
    totalViews: data.viewHistory.length,
    totalDownloads: data.downloadHistory.length,
    totalLikes: data.likeHistory.length,
    topCategory: preferred.length > 0 ? preferred[0].category : null,
    topCategories: preferred.slice(0, 3).map(p => p.category),
    isReturning: isReturningUser(),
    sessionsCount: data.sessions.totalVisits,
    devicePreference: data.devicePreference
  };
};

/**
 * Get "For You" section label based on behavior
 */
export const getPersonalizedLabel = () => {
  const data = getBehaviorData();
  const preferred = getPreferredCategories();
  
  if (preferred.length === 0) return 'Trending Now';
  if (data.downloadHistory.length > 5) return 'Curated for You';
  if (data.viewHistory.length > 10) return 'Based on Your Interests';
  return 'Recommended for You';
};
// ─── Enhanced Engagement Functions ──────────────────────────

/**
 * Update user's engagement streak (call on each session start)
 */
export const updateEngagementStreak = () => {
  const data = getBehaviorData();
  const today = new Date().toDateString();
  const lastActive = data.engagement?.lastActiveDate;
  
  if (!data.engagement) {
    data.engagement = {
      streakDays: 1,
      lastActiveDate: today,
      achievements: [],
      totalTimeSpent: 0,
      interactionCount: 0,
      favoriteHour: null,
      discoveryScore: 0
    };
  } else if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive === yesterday.toDateString()) {
      // Consecutive day - increase streak
      data.engagement.streakDays = (data.engagement.streakDays || 0) + 1;
    } else if (lastActive !== today) {
      // Streak broken - reset to 1
      data.engagement.streakDays = 1;
    }
    data.engagement.lastActiveDate = today;
  }
  
  saveBehaviorData(data);
  return data.engagement.streakDays;
};

/**
 * Track interaction for engagement scoring
 */
export const trackInteraction = (type = 'general') => {
  const data = getBehaviorData();
  
  if (!data.engagement) {
    data.engagement = getDefaultData().engagement;
  }
  
  data.engagement.interactionCount = (data.engagement.interactionCount || 0) + 1;
  
  // Track favorite browsing hour
  const hour = new Date().getHours();
  data.engagement.favoriteHour = hour;
  
  saveBehaviorData(data);
};

/**
 * Get discovery suggestions - unexplored categories to encourage exploration
 */
export const getDiscoverySuggestions = (allCategories) => {
  const data = getBehaviorData();
  const exploredCategories = Object.keys(data.categoryScores || {});
  
  // Find unexplored categories
  const unexplored = allCategories.filter(cat => 
    cat.id !== 'all' && !exploredCategories.includes(cat.id)
  );
  
  // Mix in some rarely explored categories (score < 3)
  const rarelyExplored = Object.entries(data.categoryScores || {})
    .filter(([_, score]) => score < 3)
    .map(([cat]) => allCategories.find(c => c.id === cat))
    .filter(Boolean);
  
  return {
    unexplored: unexplored.slice(0, 3),
    rarelyExplored: rarelyExplored.slice(0, 2),
    suggestion: unexplored.length > 0 
      ? `Discover ${unexplored[0].name} wallpapers!`
      : rarelyExplored.length > 0 
        ? `More ${rarelyExplored[0].name} waiting for you!`
        : 'You\'ve explored all categories!'
  };
};

/**
 * Get personalized content mix for maximum engagement
 * Returns a mix ratio of familiar vs discovery content
 */
export const getContentMixRatio = () => {
  const data = getBehaviorData();
  const sessionsCount = data.sessions?.totalVisits || 1;
  const viewCount = data.viewHistory?.length || 0;
  
  // New users: More popular content
  // Returning users: More personalized 
  // Power users: Mix in discovery
  
  if (sessionsCount <= 2) {
    return { popular: 0.7, personalized: 0.2, discovery: 0.1 };
  } else if (viewCount < 20) {
    return { popular: 0.4, personalized: 0.5, discovery: 0.1 };
  } else if (viewCount < 50) {
    return { popular: 0.2, personalized: 0.6, discovery: 0.2 };
  } else {
    return { popular: 0.1, personalized: 0.5, discovery: 0.4 };
  }
};

/**
 * Get engagement-boosting prompts to show users
 */
export const getEngagementPrompt = () => {
  const data = getBehaviorData();
  const viewCount = data.viewHistory?.length || 0;
  const downloadCount = data.downloadHistory?.length || 0;
  const likeCount = data.likeHistory?.length || 0;
  const streakDays = data.engagement?.streakDays || 0;
  
  const prompts = [];
  
  // Streak-based prompts
  if (streakDays >= 3) {
    prompts.push({
      type: 'streak',
      message: `🔥 ${streakDays} day streak! Keep exploring!`,
      priority: 3
    });
  }
  
  // Activity-based prompts
  if (viewCount > 10 && downloadCount === 0) {
    prompts.push({
      type: 'download-cta',
      message: '💾 Found something you like? Download it for free!',
      priority: 2
    });
  }
  
  if (viewCount > 5 && likeCount === 0) {
    prompts.push({
      type: 'like-cta',
      message: '❤️ Love something? Hit the heart to save it!',
      priority: 1
    });
  }
  
  // Discovery prompts
  const categoriesExplored = Object.keys(data.categoryScores || {}).length;
  if (categoriesExplored < 3 && viewCount > 10) {
    prompts.push({
      type: 'explore',
      message: '🎨 Explore more categories to find your perfect style!',
      priority: 2
    });
  }
  
  // Milestone prompts
  if (downloadCount === 10 || downloadCount === 25 || downloadCount === 50) {
    prompts.push({
      type: 'milestone',
      message: `🎉 Amazing! You've downloaded ${downloadCount} wallpapers!`,
      priority: 4
    });
  }
  
  // Return highest priority prompt
  return prompts.sort((a, b) => b.priority - a.priority)[0] || null;
};

/**
 * Get similar content recommendations based on recent activity
 */
export const getSimilarContentTags = () => {
  const data = getBehaviorData();
  const recentViews = data.viewHistory?.slice(-10) || [];
  
  // Get most common categories from recent views
  const categoryCounts = {};
  recentViews.forEach(v => {
    if (v.category) {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
    }
  });
  
  const sorted = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([cat]) => cat);
  
  return sorted.slice(0, 3);
};

/**
 * Calculate user engagement score (0-100)
 */
export const getEngagementScore = () => {
  const data = getBehaviorData();
  let score = 0;
  
  // View engagement (max 25 points)
  score += Math.min(25, (data.viewHistory?.length || 0) * 0.5);
  
  // Download engagement (max 25 points)
  score += Math.min(25, (data.downloadHistory?.length || 0) * 2.5);
  
  // Like engagement (max 15 points)
  score += Math.min(15, (data.likeHistory?.length || 0) * 1.5);
  
  // Session engagement (max 15 points)
  score += Math.min(15, (data.sessions?.totalVisits || 0) * 1.5);
  
  // Streak bonus (max 10 points)
  score += Math.min(10, (data.engagement?.streakDays || 0) * 2);
  
  // Discovery bonus (max 10 points)
  const categoriesExplored = Object.keys(data.categoryScores || {}).length;
  score += Math.min(10, categoriesExplored * 1.5);
  
  return Math.round(Math.min(100, score));
};

/**
 * Get time-based greeting and recommendation
 */
export const getTimeBasedRecommendation = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return {
      greeting: 'Good morning! ☀️',
      suggestion: 'Start your day with fresh wallpapers',
      categories: ['nature', 'minimalist', 'abstract']
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon! 🌤️',
      suggestion: 'Take a break and explore',
      categories: ['gaming', 'space', 'architecture']
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good evening! 🌅',
      suggestion: 'Wind down with beautiful visuals',
      categories: ['nature', 'gradient', 'dark']
    };
  } else {
    return {
      greeting: 'Night owl? 🌙',
      suggestion: 'Perfect time for dark themes',
      categories: ['dark', 'space', 'abstract']
    };
  }
};