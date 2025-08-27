# Frontend Deployment Guide

## Netlify Deployment

### Prerequisites
- Netlify account
- GitHub repository connected to Netlify

### Deployment Steps

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy

### Environment Configuration

The application automatically detects the environment:
- **Development**: Uses `http://localhost:8080`
- **Production**: Uses `https://mynotemaker.onrender.com`

### Important Files

1. **`public/_redirects`**: Handles React Router routing
   ```
   /* /index.html 200
   ```

2. **`src/config/api.js`**: API configuration for different environments

### Troubleshooting

1. **CORS Issues**: Ensure backend allows requests from your Netlify domain
2. **Routing Issues**: Verify `_redirects` file is in the `public` folder
3. **API Connection**: Check that the backend URL is correct in production

### Post-Deployment

1. Test all functionality:
   - User registration/login
   - Note creation
   - Note viewing
   - Profile access

2. Remove migration button from LeftNav component after confirming everything works
