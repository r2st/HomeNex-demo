// HomeNex Embeddable Property Rates Widget
// Add to any website to show nearby property rates with a link back to HomeNex
(function() {
  var container = document.getElementById('homenex-widget');
  if (!container) return;

  var SITE = 'https://home.doaide.com';
  var properties = [
    { title: 'Brigade Cornerstone', locality: 'Whitefield', price: '₹78L', bhk: '2 BHK' },
    { title: 'Prestige Lakeside', locality: 'Whitefield', price: '₹1.35Cr', bhk: '3 BHK' },
    { title: 'Sobha Dream Acres', locality: 'Sarjapur Road', price: '₹62L', bhk: '2 BHK' },
    { title: 'Godrej Splendour', locality: 'Electronic City', price: '₹1.1Cr', bhk: '3 BHK' },
  ];

  var html = '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;border:1px solid #e9e4d9;border-radius:12px;overflow:hidden;background:#fff">';
  html += '<div style="background:#166534;color:#fff;padding:12px 16px;font-weight:700;font-size:14px;display:flex;align-items:center;gap:8px"><span>🏡</span> Property Rates · Bengaluru</div>';

  properties.forEach(function(p, i) {
    html += '<div style="display:flex;justify-content:space-between;padding:10px 16px;font-size:13px;' + (i > 0 ? 'border-top:1px solid #e9e4d9;' : '') + '">';
    html += '<div><strong>' + p.title + '</strong><br><span style="color:#8b988f;font-size:11px">' + p.bhk + ' · ' + p.locality + '</span></div>';
    html += '<span style="font-weight:700;color:#0e4429">' + p.price + '</span>';
    html += '</div>';
  });

  html += '<div style="padding:10px 16px;text-align:center;border-top:1px solid #e9e4d9;font-size:12px">';
  html += '<a href="' + SITE + '#search" target="_blank" style="color:#166534;font-weight:700;text-decoration:none">View all properties on HomeNex →</a>';
  html += '</div>';
  html += '<div style="padding:6px 16px 10px;font-size:10px;color:#8b988f;text-align:center">Powered by <a href="' + SITE + '" target="_blank" style="color:#166534;text-decoration:none">HomeNex</a></div>';
  html += '</div>';

  container.innerHTML = html;
})();
