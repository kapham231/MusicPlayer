const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

//const PLAYER_STORAGE_KEY = 'key'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playList = $('.playlist')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    //config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Thủy Triều',
            singer: 'Quang Hùng MasterD',
            path: './assets/Songs/tt.mp3',
            image: './assets/Banners/tt.jpg'
        },
        {
            name: 'Buồn hay vui',
            singer: 'VSOUL, RPT MCK, Obito',
            path: './assets/Songs/bhv.mp3',
            image: './assets/Banners/bhv.jpg'
        },
        {
            name: 'Chúng ta của tương lai',
            singer: 'Sơn Tùng MTP',
            path: './assets/Songs/ctctl.mp3',
            image: './assets/Banners/ctcht.jfif'
        },
        {
            name: 'Có thể hay không',
            singer: 'Trương Tử Hào',
            path: './assets/Songs/cthk.mp3',
            image: './assets/Banners/cthk.jpg'
        },
        {
            name: 'Một triệu khả năng',
            singer: 'Trương Hàm Vận',
            path: './assets/Songs/mtkn.mp3',
            image: './assets/Banners/mtkn.jpg'
        },
        {
            name: 'Ác ma đến từ thiên đường',
            singer: 'Đặng Tử Kỳ',
            path: './assets/Songs/amdttd.mp3',
            image: './assets/Banners/amdttd.jpg'
        },
        {
            name: 'Vây giữ',
            singer: 'Vương Tĩnh Văn',
            path: './assets/Songs/vg.mp3',
            image: './assets/Banners/vg.jpg'
        },
        {
            name: 'Stone Block',
            singer: 'Ha Hyun Woo',
            path: './assets/Songs/StoneBlock.mp3',
            image: './assets/Banners/stoneblock.jpg'
        },
        {
            name: 'Kiêu ngạo',
            singer: '囂張',
            path: './assets/Songs/KieuNgao.mp3',
            image: './assets/Banners/kieungao.jpg'
        }

    ],

    // setConfig: function(key, value) {
    //     _this.config[key] = value
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Rotate Disk
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10secs
            iteration: Infinity
        })
        cdThumbAnimate.pause()

        // Zoom in/ Zoom out
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }

        // Play/Pause
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                _this.isPlaying = false
                audio.pause()
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            else {
                _this.isPlaying = true
                audio.play()
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
        }

        // Progress of Line
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) *100)
                progress.value = progressPercent
            }
        }

        //Skip Progress
        progress.onchange = function(e) {
            const seekTime = (e.target.value * audio.duration)/100
            audio.currentTime = seekTime
        }
        
        //Next Song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Prev Song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Random Song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            //_this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Repeat a song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
           // _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Next song when audio end
        audio.onended = function() {
            if (_this.isRepeat){
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }

        //Click on playlist and change song
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if ( songNode || e.target.closest('.option')) {
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    //Active when miss in view
    scrollToActiveSong: function() {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })

        }, 300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    // loadConfig: function() {
    //     this.isRandom = this.config.isRandom
    //     this.isRepeat = this.config.isRepeat
    // },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex > this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(this.currentIndex == newIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        //Load Config
        //this.loadConfig()
        // Define property for Objects
        this.defineProperties()
        // Listener for Events
        this.handleEvents()
        //Load current song
        this.loadCurrentSong()
        // Render songs
        this.render()

        //Show Config
        // randomBtn.classList.toggle('active', this.isRandom)
        // repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start();

