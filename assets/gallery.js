/*--Gallery--*/
class ModaleGallery 
{
    constructor(modale, picturesParentNode) 
    {
        this.modale = modale
        modale.addEventListener("click", e => this.closeModale())
        this.modalePic = this.addModalePic()

        this.picsParentNode = picturesParentNode
        this.picNodes = picturesParentNode.children
        this.addListenersToPics()

        this.categories = this.#parseCategories(this.picNodes)
        this.filtersContainer = document.createElement("ul")
        this.activeFilter = "Tous"
        this.currentPictureIndex = 0
        this.displayFilters()

        this.previousButton = document.querySelector("#previousButton")
        this.nextButton = document.querySelector("#nextButton")
        this.previousButton.addEventListener("click", e => this.previousPic(e))
        this.nextButton.addEventListener("click", e => this.nextPic(e))

        window.addEventListener('keydown', e => this.#keyboardListener(e))
    }

    addModalePic()
    {
        const pic = document.createElement("img")
        pic.setAttribute('id','modalePic')
        pic.classList.add("modalPic")
        this.modale.prepend(pic)
        return pic
    }

    #parseCategories(pictures) 
    {
        let cat = []
        cat.push("Tous")
        Array.from(pictures).forEach(pic => {
          if(!cat.includes(pic.dataset.galleryTag))
          {
              cat.push(pic.dataset.galleryTag)
          }
        })
        return cat
    }

    picsFiltering()
    {
        if (this.activeFilter==="Tous") {
          Array.from(this.picNodes).forEach(pic => pic.style.display="block")
          return
        }
        Array.from(this.picNodes).forEach(pic => pic.dataset.galleryTag === this.activeFilter ? pic.style.display="block" : pic.style.display="none" )
    }

    makeFilterButtonActive(selectedFilter)
    {
        Array.from(this.filtersContainer.children).forEach(fil => fil.classList.remove("active"))
        selectedFilter.classList.add("active")
    }

    displayFilters()
    {
        this.filtersContainer.classList.add("my-4", "tags-bar", "nav", "nav-pills")
        this.categories.forEach(filter => {
          const filterEl = document.createElement("li")
          if(filter === this.activeFilter) filterEl.classList.add("active")
          filterEl.classList.add("nav-item", "nav-link")
          filterEl.innerHTML = filter
          filterEl.addEventListener("click", () => {
            this.makeFilterButtonActive(filterEl)
            this.activeFilter = filter
            this.picsFiltering()
          })
          this.filtersContainer.append(filterEl)
        })
        this.picsParentNode.parentElement.prepend(this.filtersContainer)
    }

    #keyboardListener(e)
    {
        if(e.keyCode == 27)
        {
            return this.closeModale()
        }

        if(e.keyCode == 37)
        {
            return this.nextPic()
        }

        if(e.keyCode == 39)
        {
            return this.previousPic()
        }
    }

    addListenersToPics()
    {
        Array.from(this.picNodes).forEach((pic, index) => pic.addEventListener("click", e => this.showModale(pic.src, index)))
    }

    setModalePic(picture)
    {
        console.log(picture)
        this.modalePic.src=picture
    }

    #scrollLock(bool = false)
    {
        if(bool)
        {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop
            let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
            window.onscroll = () => {
                window.scrollTo(scrollLeft, scrollTop)
            }
        }else{
            window.onscroll = () => {}
        }
    }

    showModale(picSrc, index)
    {
        this.#scrollLock(true)
        console.log(picSrc)
        this.currentPictureIndex = index
        this.setModalePic(picSrc)
        this.modale.showModal()
        this.modale.style.display = "flex"        
    }

    closeModale()
    {
        this.modale.style.display = "none"
        this.modale.close()
        this.#scrollLock(false)
    }

    previousPic(e)
    {
        if(e)
        {
            e.stopPropagation()
            e.preventDefault()
        }
        do
        {
            this.currentPictureIndex > 0 ? this.currentPictureIndex-- : this.currentPictureIndex = this.picNodes.length-1
            if (this.activeFilter === "Tous") {break;}
        }
        while(this.picNodes[this.currentPictureIndex].dataset.galleryTag !== this.activeFilter)
        
        this.modalePic.src=this.picNodes[this.currentPictureIndex].src
    }

    nextPic(e)
    {
        if(e)
        {
            e.stopPropagation()
            e.preventDefault()
        }
        do
        {
            this.currentPictureIndex < this.picNodes.length-1 ? this.currentPictureIndex++ : this.currentPictureIndex = 0
            if (this.activeFilter === "Tous") {break;}
        }
        while(this.picNodes[this.currentPictureIndex].dataset.galleryTag !== this.activeFilter)

        this.modalePic.src=this.picNodes[this.currentPictureIndex].src
    }
}

function onloadIndex(){
  const gallery = new ModaleGallery(document.querySelector("#modale"), document.querySelector("#pictures"))
}