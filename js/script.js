// var paragraphs = document.getElementsByTagName('p');
// for (var i = 0; i < paragraphs.length; i++) {
//   var paragraph = paragraphs.item(i);
//   paragraph.style.setProperty('color', 'blue', null);
// }
class SystemController {
  constructor() {}

  setNavColor() {
    let navLinks = document.querySelectorAll('nav a');
    let pathName = window.location.pathname;
    navLinks.forEach((e) => {
      if (pathName.toLowerCase() == '/' && e.id.toLowerCase() == 'home') {
        e.classList.add('js-bg');
      } else if (pathName.toLowerCase().includes(e.id.toLowerCase())) {
        e.classList.add('js-bg');
      }
    });
  }
}

/**
 * Beginning of Execution
 */
(() => {
  console.log('this is d3 in the self', d3);
  console.log(window.location);

  let systemController = new SystemController();
  systemController.setNavColor();
})(d3);
