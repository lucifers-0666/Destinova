# Destinova Login React Component

This folder contains a standalone React component (`DestinovaLogin.jsx`) implementing the Destinova login page experience per the provided design specification.

## Highlights
- Split-screen layout (45% hero / 55% form)
- Deep green hero with subtle parallax overlay and trust indicators
- Elevated white form card with complete validation and interactions
- Accessible (labels, ARIA, focus outlines)
- Responsive and performant

## Usage
1. Ensure Tailwind (or similar utility CSS) and Font Awesome are available in your app, or swap out utilities/icons as you prefer.
2. Import and render the component:

```jsx
import DestinovaLogin from './react/DestinovaLogin';

function App() {
  return <DestinovaLogin />;
}
```

If you’re not using Tailwind, convert the utility classes to your styling solution.

## Notes
- This is a presentational component; replace the stubbed submit handler with your auth API call.
- Hero background references `../site-images/FC-P1.webp`; adjust path as needed.
