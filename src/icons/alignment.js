module.exports = (align) => {
  if (align === 'justify') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 17H5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 12H5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 7H5"/></svg>';
  } if (align === 'center') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 17H5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 12L8 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 7L5 7"/></svg>';
  } if (align === 'right') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 17H7"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 12L11 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 7L7 7"/></svg>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M17 17H5" /><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13 12L5 12" /><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M17 7L5 7" /></svg>';
};