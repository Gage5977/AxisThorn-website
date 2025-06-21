// API Router - Handles versioning and routing
const { logger } = require('./middleware/security');

// Available API versions
const apiVersions = {
  v1: require('./v1'),
  // Future versions can be added here
  // v2: require('./v2'),
};

// Default version if none specified
const DEFAULT_VERSION = 'v1';

// Version compatibility mapping (for backward compatibility)
const versionAliases = {
  latest: 'v1',
  stable: 'v1',
};

// Main router handler
module.exports = async (req, res, next) => {
  try {
    // Extract version from URL
    const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
    
    // Check if this is an API request
    if (urlParts[0] !== 'api') {
      return res.status(404).json({ error: 'Not found' });
    }
    
    // Determine API version
    let version = urlParts[1];
    
    // Handle version aliases
    if (versionAliases[version]) {
      version = versionAliases[version];
    }
    
    // If no version specified, check Accept header for version
    if (!version || !apiVersions[version]) {
      const acceptHeader = req.headers['accept-version'] || req.headers['x-api-version'];
      if (acceptHeader && apiVersions[acceptHeader]) {
        version = acceptHeader;
      } else if (acceptHeader && versionAliases[acceptHeader]) {
        version = versionAliases[acceptHeader];
      } else {
        // Use default version if no valid version found
        version = DEFAULT_VERSION;
        // Reconstruct URL with default version
        req.url = `/api/${version}${req.url.substring(4)}`;
      }
    }
    
    // Get the version handler
    const versionHandler = apiVersions[version];
    
    if (!versionHandler) {
      logger.warn(`Invalid API version requested: ${version}`);
      return res.status(400).json({
        error: 'Invalid API version',
        requestedVersion: version,
        supportedVersions: Object.keys(apiVersions),
        defaultVersion: DEFAULT_VERSION
      });
    }
    
    // Add deprecation warnings for older versions
    if (version !== DEFAULT_VERSION) {
      res.setHeader('X-API-Deprecation-Warning', `API ${version} is deprecated. Please migrate to ${DEFAULT_VERSION}`);
      res.setHeader('X-API-Sunset-Date', '2025-12-31'); // Example sunset date
    }
    
    // Log API version usage
    logger.info(`API ${version} request: ${req.method} ${req.url}`);
    
    // Call the version-specific handler
    return versionHandler(req, res);
    
  } catch (error) {
    logger.error('API Router Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};