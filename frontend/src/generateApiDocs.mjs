/* eslint-disable max-len */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File paths
const tsFilePath = join(__dirname, 'api.ts');
const routesFilePath = join(__dirname, 'routes/backend.ts');
const outputFilePath = join(__dirname, '../../docs/api_documentation.md');

// Read file contents
const tsFileContent = readFileSync(tsFilePath, 'utf-8');
const routesFileContent = readFileSync(routesFilePath, 'utf-8');

function extractApiFunctions(tsContent) {
  const lines = tsContent.split('\n');
  const functions = [];
  let functionName = '';
  let routeKey = '';
  let isInFunction = false;
  let description = '';

  lines.forEach((line) => {
    if (line.trim().startsWith('/**')) {
      description = '';
    } else if (line.trim().startsWith('*')) {
      description += line.trim().replace(/^\*\s?/, '') + ' ';
    } else if (line.trim().startsWith('*/')) {
      description = description.trim();
    }

    if (line.includes('export async function')) {
      functionName = line.split(' ')[3].split('(')[0];
      isInFunction = true;
    }

    if (isInFunction) {
      if (line.includes('ROUTES.backend.')) {
        const routeMatch = line.match(/ROUTES\.backend\.(\w+)/);
        if (routeMatch) {
          routeKey = routeMatch[1];
        }
      } else if (line.includes('reverse({')) {
        const patternMatch = line.match(/pattern:\s*ROUTES\.backend\.(\w+)/);
        if (patternMatch) {
          routeKey = patternMatch[1];
        }
      }

      if (line.includes('axios.')) {
        const methodMatch = line.match(/axios\.(\w+)/);
        let method = methodMatch ? methodMatch[1].toUpperCase() : 'UNKNOWN';
        functions.push({ functionName, method, routeKey, description });
        isInFunction = false;
        description = '';
        routeKey = '';
      }
    }
  });

  return functions;
}

function extractRoutes(routesContent) {
  const lines = routesContent.split('\n');
  const routes = {};

  lines.forEach((line) => {
    const match = line.match(/(\w+):\s*['"](.+)['"]/);
    if (match) {
      const [, key, value] = match;
      routes[key] = value;
    }
  });

  return routes;
}

function generateMarkdown(apiFunctions, routes) {
  const currentDate = new Date().toISOString().split('T')[0];
  let markdownContent =
    '# API Documentation\n\n' +
    `*==auto-generated== by "generateApiDocs.mjs" on ${currentDate}*.\n\n` +
    'Generate new documentation by going to *Samfundet4/frontend/src* in the terminal and running \n\n' +
    '`node generateApiDocs.mjs` \n\n' +
    'If API methods have JSDocs associated with them, it will be documented in the description.\n\n' +
    'Server must of course be running to access local endpoints. Clicking some link should take you to the DRF user-interface. \n\n';

  apiFunctions.forEach((api) => {
    const { functionName, method, routeKey, description } = api;
    let route = routes[routeKey];
    if (!route) {
      console.log(`Route not found for ${functionName} with key ${routeKey}`);
      route = 'Route not found';
    }
    const fullRoute = route !== 'Route not found' ? `http://localhost:8000${route}` : route;
    markdownContent += `## \`${functionName}\`\n`;
    markdownContent += `- **Method**: \`${method}\`\n`;
    markdownContent += `- **Endpoint**: [\`${fullRoute}\`](${fullRoute})\n`;
    markdownContent += `- **Route Key**: \`${routeKey || 'Not found'}\`\n`;
    markdownContent += `#### **Description**: \n\n ${description || 'No description provided.'}\n\n`;
  });
  return markdownContent;
}

function generateApiDocs() {
  const apiFunctions = extractApiFunctions(tsFileContent);
  const routes = extractRoutes(routesFileContent);
  const markdownContent = generateMarkdown(apiFunctions, routes);
  writeFileSync(outputFilePath, markdownContent, 'utf-8');
  console.log('API documentation generated in:', outputFilePath);
}

generateApiDocs();
