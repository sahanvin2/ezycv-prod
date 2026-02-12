#!/usr/bin/env node
/**
 * Quick seed script - populates wallpapers and photos with sample data
 * Usage: node scripts/quickSeed.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    
    const Wallpaper = require('../models/Wallpaper');
    const Photo = require('../models/Photo');
    
    const [wc, pc] = await Promise.all([Wallpaper.countDocuments(), Photo.countDocuments()]);
    console.log(`Current: ${wc} wallpapers, ${pc} photos`);
    
    // Seed wallpapers if empty
    if (wc === 0) {
      const sampleWallpapers = [];
      const cats = [
        { cat: 'nature', ids: [1015,1035,1036,1039,1040,1043,1018,1044,1045,1047], titles: ['Mountain Sunrise','Ocean Waves','Autumn Forest','Alpine Lake','Lavender Fields','Tropical Paradise','Misty Mountains','Forest Waterfall','Sunset Beach','Green Valley'] },
        { cat: 'abstract', ids: [10,11,12,13,14,15,16,17,18,19], titles: ['Neon Waves','Color Burst','Geometric Flow','Light Trails','Fluid Art','Digital Waves','Prism Light','Smoke Tendrils','Crystal','Fusion'] },
        { cat: 'animals', ids: [40,41,42,43,44,45,46,47,48,49], titles: ['Majestic Lion','Eagle Flight','Tropical Fish','Wild Horse','Snow Leopard','Hummingbird','Wolf Pack','Butterfly','Coral Reef','Arctic Fox'] },
        { cat: 'architecture', ids: [101,103,104,105,106,107,108,109,160,161], titles: ['Modern Skyscraper','Gothic Cathedral','Bridge Night','City Skyline','Glass Building','Ancient Temple','Urban Streets','Aerial View','Tower','Facade'] },
        { cat: 'space', ids: [110,111,112,113,114,115,116,117,118,158], titles: ['Galaxy Spiral','Nebula Cloud','Star Field','Planet Earth','Solar Eclipse','Milky Way','Space Station','Cosmic Rays','Deep Space','Asteroid'] },
        { cat: 'gaming', ids: [119,120,121,122,123,124,125,126,127,155], titles: ['Cyberpunk City','Pixel World','Fantasy Realm','Retro Arcade','Neon Racer','RPG Land','Battle Arena','Sci-Fi Base','VR World','Game Over'] },
        { cat: 'minimalist', ids: [128,129,130,131,132,133,134,135,156,157], titles: ['Clean Lines','Soft Gradient','Mono Shapes','White Space','Simple Beauty','Pure Design','Zen Garden','Calm Horizon','Serenity','Balance'] },
        { cat: 'dark', ids: [136,137,139,140,141,142,143,144,159,162], titles: ['Dark Moody','Midnight','Shadow Play','Night City','Dark Bloom','Deep Ocean','Eclipse','Noir Streets','Void','Dusk'] },
        { cat: 'gradient', ids: [145,146,147,149,151,152,153,154,163,166], titles: ['Sunset Gradient','Ocean Blues','Purple Haze','Golden Hour','Pink Fade','Cool Mint','Warm Ember','Sky Blend','Ombre','Pastel'] },
      ];
      
      cats.forEach(({ cat, ids, titles }) => {
        ids.forEach((id, i) => {
          const isMobile = i >= 8;
          sampleWallpapers.push({
            title: titles[i],
            description: `Beautiful ${titles[i].toLowerCase()} ${cat} wallpaper`,
            category: cat,
            deviceType: isMobile ? 'mobile' : 'desktop',
            imageUrl: `https://picsum.photos/id/${id}/${isMobile ? '1080/1920' : '3840/2160'}`,
            thumbnailUrl: `https://picsum.photos/id/${id}/${isMobile ? '225/400' : '400/225'}`,
            previewUrl: `https://picsum.photos/id/${id}/${isMobile ? '540/960' : '800/450'}`,
            downloadUrl: `https://picsum.photos/id/${id}/${isMobile ? '1440/2560' : '5120/2880'}`,
            resolution: isMobile ? { width: 1080, height: 1920 } : { width: 3840, height: 2160 },
            tags: [cat, isMobile ? 'mobile' : 'desktop', 'hd'],
            downloads: Math.floor(Math.random() * 500) + 100,
            likes: Math.floor(Math.random() * 200) + 50,
            views: Math.floor(Math.random() * 2000) + 500,
            featured: i < 2,
            storageType: 'local'
          });
        });
      });
      
      await Wallpaper.insertMany(sampleWallpapers);
      console.log(`✅ Seeded ${sampleWallpapers.length} wallpapers`);
    } else {
      console.log('Wallpapers already exist, skipping.');
    }
    
    // Seed photos if empty
    if (pc === 0) {
      const samplePhotos = [];
      const cats = [
        { cat: 'business', ids: [180,183,185,186,187,188,190,191,192,193], titles: ['Modern Office','Team Meeting','Startup Space','Business Strategy','Conference Room','Laptop Work','Corporate Event','Coworking','Presentation','Office Interior'] },
        { cat: 'technology', ids: [0,1,2,3,4,5,6,7,8,9], titles: ['Circuit Board','Code Screen','Smart Devices','Server Room','Robot Hand','VR Headset','Drone','Digital UI','Chip Design','Future Tech'] },
        { cat: 'people', ids: [64,65,66,67,68,69,70,71,72,73], titles: ['Happy Portrait','Team Collab','Family Moment','Young Pro','Friends','Creative Artist','Fitness','Student Life','Chef','Musician'] },
        { cat: 'nature', ids: [28,29,30,31,32,33,34,35,36,37], titles: ['Spring Flowers','Rainforest','Desert Dunes','Snowy Peak','River Rapids','Autumn Leaves','Cherry Blossom','Northern Lights','Coral Garden','Sunrise Valley'] },
        { cat: 'food', ids: [225,292,312,326,365,429,431,488,490,493], titles: ['Gourmet Dish','Fresh Salad','Coffee Art','Pastry','Fruit Bowl','Asian Cuisine','BBQ Platter','Dessert Table','Smoothie Bowl','Farm Fresh'] },
        { cat: 'travel', ids: [164,165,167,168,169,170,171,173,174,175], titles: ['Paris Streets','Tropical Island','Mountain Trek','Ancient Ruins','Harbor View','Desert Road','Cultural Market','Alpine Village','Beach Resort','City Night'] },
        { cat: 'fashion', ids: [177,200,201,202,203,204,206,208,209,210], titles: ['Street Style','Designer Wear','Accessories','Fashion Show','Casual Look','Elegant Dress','Vintage','Modern Style','Bohemian','Formal'] },
        { cat: 'health', ids: [214,215,216,217,218,219,220,221,222,223], titles: ['Yoga Practice','Healthy Meal','Running','Meditation','Gym Workout','Wellness Spa','Stretching','Swimming','Cycling','Nature Walk'] },
        { cat: 'education', ids: [250,251,252,253,254,255,256,257,258,259], titles: ['Library Study','Classroom','Lab Research','Graduation','Book Collection','Online Learning','Science Lab','Art Class','Math','Campus Life'] },
      ];
      
      cats.forEach(({ cat, ids, titles }) => {
        ids.forEach((id, i) => {
          samplePhotos.push({
            title: titles[i],
            description: `High-quality ${titles[i].toLowerCase()} ${cat} photo`,
            category: cat,
            imageUrl: `https://picsum.photos/id/${id}/1920/1280`,
            thumbnailUrl: `https://picsum.photos/id/${id}/400/267`,
            resolution: { width: 1920, height: 1280 },
            tags: [cat, 'stock', 'free'],
            license: 'free',
            downloads: Math.floor(Math.random() * 400) + 80,
            likes: Math.floor(Math.random() * 180) + 40,
            views: Math.floor(Math.random() * 2000) + 400,
            featured: i < 2,
            storageType: 'local'
          });
        });
      });
      
      await Photo.insertMany(samplePhotos);
      console.log(`✅ Seeded ${samplePhotos.length} photos`);
    } else {
      console.log('Photos already exist, skipping.');
    }
    
    // Verify
    const [newWc, newPc] = await Promise.all([Wallpaper.countDocuments(), Photo.countDocuments()]);
    console.log(`\n📊 Final counts: ${newWc} wallpapers, ${newPc} photos`);
    console.log('Done!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seed();
