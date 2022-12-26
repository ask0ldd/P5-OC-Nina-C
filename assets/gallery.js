/*--Gallery--*/
const oldCloseMethod = HTMLDialogElement.prototype.close
const oldShowModalMethod = HTMLDialogElement.prototype.showModal
let modalePic
let activeFilter = "Tous"
let currentPictureIndex = 0

HTMLDialogElement.prototype.close = function()
{
  this.style.display = "none"
  oldCloseMethod.apply(this)
}

HTMLDialogElement.prototype.showModal = function(picSrc, index)
{
  currentPictureIndex = index
  modalePic.src=picSrc
  oldShowModalMethod.apply(this)
  this.style.display = "flex"
}

class gallery {
  constructor(modale, imgNodes) {
  }
}

function previousPic(e, pictures)
{
  e.stopPropagation()
  e.preventDefault();
  do
  {
    currentPictureIndex > 0 ? currentPictureIndex-- : currentPictureIndex = pictures.length-1
    if (activeFilter === "Tous") {break;}
  }
  while(pictures[currentPictureIndex].dataset.galleryTag !== activeFilter)
  
  modalePic.src=pictures[currentPictureIndex].src
}

function nextPic(e, pictures)
{
  e.stopPropagation()
  e.preventDefault();
  do
  {
    currentPictureIndex < pictures.length-1 ? currentPictureIndex++ : currentPictureIndex = 0
    if (activeFilter === "Tous") {break;}
  }
  while(pictures[currentPictureIndex].dataset.galleryTag !== activeFilter)

  modalePic.src=pictures[currentPictureIndex].src
}

function parseFilters(pictures){
  let categories = []
  categories.push("Tous")
  Array.from(pictures).forEach(pic => {
    if(!categories.includes(pic.dataset.galleryTag))
    {
        categories.push(pic.dataset.galleryTag)
    }
  })

  return categories
}

function makeFilterButtonActive(filtersContainer, filter)
{
  Array.from(filtersContainer.children).forEach(fil => fil.classList.remove("active"))
  filter.classList.add("active")
}

function PicturesFiltering(){
  const pictures = document.querySelector("#pictures").children
  if (activeFilter==="Tous") {
    Array.from(pictures).forEach(pic => pic.style.display="block")
    return
  }
  Array.from(pictures).forEach(pic => pic.dataset.galleryTag === activeFilter ? pic.style.display="block" : pic.style.display="none" )
}

function displayFilterButtons(filters){
  const galleryContainer = document.querySelector("#pictures").parentElement
  const filtersContainer = document.createElement("ul")
  filtersContainer.classList.add("my-4", "tags-bar", "nav", "nav-pills")
  //filtersContainer.innerHTML = filters.reduce((ac, cv) => ac + '<li class="nav-link">' + cv + '</li>')
  filters.forEach(filter => {
    const filterEl = document.createElement("li")
    if(filter === activeFilter) filterEl.classList.add("active")
    filterEl.classList.add("nav-item", "nav-link")
    filterEl.innerHTML = filter
    filterEl.addEventListener("click", () => {
      makeFilterButtonActive(filtersContainer, filterEl)
      activeFilter = filter
      console.log(activeFilter)
      PicturesFiltering()
    })
    filtersContainer.append(filterEl)
  })
  galleryContainer.prepend(filtersContainer)
}

function addModalePic(){
  const pic = document.createElement("img")
  pic.setAttribute('id','modalePic')
  pic.classList.add("modalPic")
  modale.prepend(pic)
  return pic
}

function onloadIndex(){
  const modale = document.querySelector("#modale")
  modalePic = addModalePic()

  //deal with children = 0
  const pictures = document.querySelector("#pictures").children
  Array.from(pictures).forEach((pic, index) => pic.addEventListener("click", e => modale.showModal(pic.src, index)))
  modale.addEventListener("click", e => modale.close())

  const filters = parseFilters(pictures)
  displayFilterButtons(filters)

  const previousButton = document.querySelector("#previousButton")
  const nextButton = document.querySelector("#nextButton")
  previousButton.addEventListener("click", e => previousPic(e, pictures))
  nextButton.addEventListener("click", e => nextPic(e, pictures))
}