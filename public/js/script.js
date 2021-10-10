startReactor = {
    // Combination Array
    combination: [],
    playerCombination: [],
    
    // Max Combination Length and Total
    combinationMax: 5,
    combinationInputsTotal: 9,

    // First Array Position
    combinationPosition: 1,
    
    // Audio Files
    audio: {
        // State Audios
        start: 'start.mp3',
        fail: 'fail.mp3',
        complete: 'complete.mp3',

        // Action Audios
        combinations: ['0.mp3', '1.mp3', '2.pm3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', '7.mp3', '8.mp3',],

        // Getting audio of clicked button
        loadAudio(filename) {
            const file = `./audio/${filename}?cb=${new Date().getTime()}`
            // Transformando em objeto de audio
            const audio = new Audio(file)
            audio.load()

            return audio
        },

        // loading all audios
        loadAudios() {
            if(typeof(this.audio.start)== "object") return
            this.audio.start = this.audio.loadAudio(this.audio.start)

            this.audio.complete = this.audio.loadAudio(this.audio.complete)
            this.audio.fail = this.audio.loadAudio(this.audio.fail)
            
            this.audio.combinations = this.audio.combinations.map(audio => this.audio.loadAudio(audio))
        },

    },
    
    // Main Methods
    interface: {
        memoryPanel: document.querySelector('.painelMemory'),
        computerLedPanel: document.querySelector('.computerLedPanel'),
        platerLedPanel: document.querySelector('.playerLedPanel'),
        playerMemory: document.querySelector('.playerMemory'),
        playerMemoryBtn: document.querySelector('.player_memory'),


        // Turn On Leds
        turnLedOn(index, ledPanel) {
            

        },

        // Turn off all leds
        turnAllLedsOff() {
            const computerLedPanel = this.interface.computerLedPanel
            const playerLedPanel = this.interface.platerLedPanel

            for(let i = 0; i < computerLedPanel.children.length; i++) {
                computerLedPanel.children[i].classList.remove('led-on')
            }

            for (let i = 0; i < playerLedPanel.children.length; i++) {
                playerLedPanel.children[i].classList.remove('led-on')   
            }
        },

        // Starting Audio
        async start() {
            return this.audio.start.play()
        }


    },

    createCombination() {
        // Criando o array da combinação
        let combination = [];

        // Pushando os valores no array
        for (let i = 0; i < this.combinationMax; i++) {
            const position = Math.floor((Math.random() * this.combinationInputsTotal) + 1)
            combination.push(position-1);
        }

        // Retornando o array
        return combination;
    },

    playCombination() {
        
    },


    load() { },
    
    start() {
        // Criando a combinação
        this.combination = this.createCombination();
        
        // Zerando as Variaveis
        this.combinationPosition = 1;
        this.playerCombination = [];

        // Dar Play na combinação do computador
        this.interface.start().then(() => {
            setTimeout(() => {
                startReactor.playCombination();
            }, 500)
        })
        

    },
    


}