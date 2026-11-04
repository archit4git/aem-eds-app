export default async function decorate(block) {
  const locationOnPage = block.querySelector(':scope div:nth-child(1) > div p').innerHTML.trim();
  block.innerHTML = `
  <div class='offers-zone' data-location-on-page="${locationOnPage}">
  </div>
`;
}
