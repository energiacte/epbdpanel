import './css/style.scss'; // CSS

//// Import React and JS
import React from 'react';
import ReactDOM from 'react-dom';

import Base from 'components/Base.jsx';

var appnode = document.body.appendChild(document.createElement("div"));

// Render
ReactDOM.render(<Base headertitle= "CTE DB-HE, aplicación de ISO 52000-1"/>, appnode);
