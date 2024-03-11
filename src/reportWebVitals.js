// Define the reportWebVitals function with an onPerfEntry parameter
const reportWebVitals = onPerfEntry => {
  // Check if onPerfEntry is a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the 'web-vitals' library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call the provided onPerfEntry function for each web vital metric
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Export the reportWebVitals function as the default export
export default reportWebVitals;
