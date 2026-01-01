# Google Drive Image Loading Fixes

## Issues Fixed

### 1. Google Drive Image URLs
**Problem:** Images were using incorrect URL format `https://lh3.googleusercontent.com/d/${file.id}=w600` which was failing to load.

**Solution:** Changed to the correct format `https://drive.google.com/uc?export=view&id=${file.id}` which properly displays images from Google Drive.

**Files Modified:**
- `src/pages/Home.jsx` - Updated hero, gallery, and event image URLs
- `src/Layout.jsx` - Updated poster image URLs

### 2. Missing Asset File
**Problem:** `falling_flowers.gif` was referenced but didn't exist in `/public/assets/`, causing 404 error.

**Solution:** Replaced with existing `flowers.png` asset.

**Files Modified:**
- `src/Layout.jsx` - Changed `flowerGifUrl` from `/assets/falling_flowers.gif` to `/assets/flowers.png`

### 3. Content Security Policy Warning
**Issue:** Google Calendar iframe loads external scripts which triggers CSP warnings.

**Status:** This is expected behavior and doesn't affect functionality. The calendar still works correctly.

## Testing

After these changes, verify:
1. ✅ Hero carousel images load from Google Drive
2. ✅ Gallery images display correctly
3. ✅ Event images show properly
4. ✅ Popup poster images load
5. ✅ No 404 errors for falling_flowers.gif
6. ✅ Background flower image displays

## Google Drive Setup Requirements

Ensure your Google Drive folders have:
- **Public sharing enabled** (Anyone with the link can view)
- **Correct folder IDs** in `.env` file:
  - `VITE_GDRIVE_FOLDER_ID_HERO`
  - `VITE_GDRIVE_FOLDER_ID`
  - `VITE_GDRIVE_FOLDER_ID_EVENTS`
  - `VITE_GDRIVE_FOLDER_ID_POSTERS`
- **Valid API key** in `VITE_GDRIVE_KEY`

## Additional Notes

- The new URL format `https://drive.google.com/uc?export=view&id=${fileId}` works for publicly shared files
- Images must be in folders with proper sharing permissions
- CSP warnings from Google Calendar iframe are normal and can be ignored
