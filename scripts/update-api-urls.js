#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Components that need updating
const componentsToUpdate = [
  'components/HolidayList/HolidayList.tsx',
  'components/MonthlyHolidayList.tsx',
  'components/YouTubeRecommendations/YouTubeRecommendations.tsx',
  'components/ProductRecommendations/ProductRecommendations.tsx',
  'components/AmazonPrimeRecommendation/AmazonPrimeRecommendation.tsx',
  'components/TourCard/TourCard.tsx',
  'components/HolidayHeroImage.tsx',
  'components/FullCalendar.tsx'
];

const replacements = [
  {
    from: /const API_KEY = process\.env\.NEXT_PUBLIC_API_KEY/g,
    to: '// Use the new FastAPI backend\nconst API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || \'http://localhost:8001/api/v1\''
  },
  {
    from: /https:\/\/www\.fechaslibres\.cl\/api\/nextHoliday/g,
    to: '`${API_URL}/holidays/next`'
  },
  {
    from: /https:\/\/www\.fechaslibres\.cl\/api\/randomVideos/g,
    to: '`${API_URL}/widgets/recommendations`'
  },
  {
    from: /headers:\s*{\s*'x-api-key':\s*API_KEY,?\s*}/g,
    to: ''
  },
  {
    from: /if \(!API_KEY\) {\s*[^}]*\s*return\s*}/g,
    to: ''
  }
];

componentsToUpdate.forEach(componentPath => {
  const fullPath = path.join(__dirname, '..', componentPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${componentPath} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  replacements.forEach(replacement => {
    if (replacement.from.test(content)) {
      content = content.replace(replacement.from, replacement.to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated ${componentPath}`);
  } else {
    console.log(`⏭️  No changes needed for ${componentPath}`);
  }
});

console.log('\nDone! All components updated to use local backend.');