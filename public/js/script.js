startReactor = {
    // Combination Array
    computerCombination: [],
    playerCombination: [],
    
    // Max Combination Length and Total
    combinationMaxPosition: 5,
    memoryMaxCombination: 9,

    // First Array Position
    computerCombinationPosition: 1,
    
    // Audio Files
    audio: {
        // State Audios
        start: 'start.mp3',
        fail: 'fail.mp3',
        complete: 'complete.mp3',

        // Action Audios
        combinations: ['0.mp3', '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', '7.mp3', '8.mp3',],

        // Getting audio of clicked button
        loadAudio(filename) {
            const file = `./public/audio/${filename}?cb=${new Date().getTime()}`
            // Transformando em objeto de audio
            const audio = new Audio(file)
            audio.load()

            return audio
        },

        // loading all audios
        loadAudios() {
            // Load Start Audio
            if (typeof(startReactor.audio.start) == "object") return
            startReactor.audio.start = startReactor.audio.loadAudio(startReactor.audio.start)

            // Load complete and fail Audios
            startReactor.audio.complete = startReactor.audio.loadAudio(startReactor.audio.complete)
            startReactor.audio.fail = startReactor.audio.loadAudio(startReactor.audio.fail)
            
            // Load Combinations Audios
            startReactor.audio.combinations = startReactor.audio.combinations.map ( (audio) => startReactor.audio.loadAudio(audio))
        },

    },
    
    // Interface Methods
    interface: {
        memoryPanel: document.querySelector('.painelMemory'),
        computerLedPanel: document.querySelector('.computerLedPanel'),
        playerLedPanel: document.querySelector('.playerLedPanel'),
        playerMemory: document.querySelector('.playerMemory'),
        playerMemoryButtons: document.querySelector('.player_memory'),


        // Turn On Leds
        turnLedOn(index, ledPanel) {
            ledPanel.children[index].classList.add("ledOn");
        },

        // Turn off all leds
        turnAllLedsOff() {
            const computerLedPanel = startReactor.interface.computerLedPanel
            const playerLedPanel = startReactor.interface.playerLedPanel

            for (var i = 0; i < computerLedPanel.children.length; i++) {
                computerLedPanel.children[i].classList.remove("ledOn");
                playerLedPanel.children[i].classList.remove("ledOn");
            }
        },

        // Starting Audio
        async start() {
            return startReactor.audio.start.play()
        },

        // Play Current Combination
        playItem(index, combinationPosition, location = 'computer') {
            // Check what led to turn on
            const leds = (location == 'computer') ? startReactor.interface.computerLedPanel : startReactor.interface.playerLedPanel
            
            // Turn on memory Panel
            const memPanel = startReactor.interface.memoryPanel.children[index]
    
            // Adding class to Panel
            memPanel.classList.add("memoryActive")
    
            // Turn on led
            startReactor.interface.turnLedOn(combinationPosition, leds)
            startReactor.audio.combinations[index].play().then(() => {
                setTimeout(() => {
                    memPanel.classList.remove("memoryActive")
                }, 150)
            })
        },

        endGame(type = "fail") {
            const memPanel = startReactor.interface.memoryPanel
            const ledPanel = startReactor.interface.computerLedPanel
            const audio = (type == "complete") ? startReactor.audio.complete : startReactor.audio.fail
            const typeClasses = (type == "complete") ? ["playerMemoryComplete", "playerLedComplete"] : ["playerMemoryError", "playerLedError"]

            startReactor.interface.disableButtons()
            startReactor.interface.turnAllLedsOff()

            audio.play().then(() => {
                for (var i = 0; i < memPanel.children.length; i++) {
                    if (memPanel.children[i].tagName == "DIV")
                        memPanel.children[i].classList.add(typeClasses[0])
                }
                for (var i = 0; i < ledPanel.children.length; i++) {
                    if (ledPanel.children[i].tagName == "DIV")
                        ledPanel.children[i].classList.add(typeClasses[1])
                }
                setTimeout(() => {
                    for (var i = 0; i < memPanel.children.length; i++) {
                    if (memPanel.children[i].tagName == "DIV")
                        memPanel.children[i].classList.remove(typeClasses[0])
                    }
                    for (var i = 0; i < ledPanel.children.length; i++) {
                    if (ledPanel.children[i].tagName == "DIV")
                        ledPanel.children[i].classList.remove(typeClasses[1])
                    }
                }, 900);
            })
        },

        // Enable Buttons
        enableButtons() {
            // Ativando Painel do Player
            const playerMemory = startReactor.interface.playerMemory
            playerMemory.classList.add('playerActive')
    
            // Verificando se os botoes estao corretos e ativando
            for (var i = 0; i < playerMemory.children.length; i++) {
                if (playerMemory.children[i].tagName == "DIV")
                    playerMemory.children[i].classList.add("playerMemoryActive")
            }
        },

        // Disable Buttons
        disableButtons() {
            // Desativando Painel do Player
            const playerMemory = startReactor.interface.playerMemory
            playerMemory.classList.remove('playerActive')

            // Verificando se os botoes estao corretos e desativando
            for (var i = 0; i < playerMemory.children.length; i++) {
            if (playerMemory.children[i].tagName == "DIV")
                playerMemory.children[i].classList.remove("playerMemoryActive");
            }
        },
        
    },


    async load() {
        return new Promise(resolve => {
            console.log("Loading Game...")
            startReactor.audio.loadAudios()

            const playerMemory  = startReactor.interface.playerMemory
            const memory = startReactor.interface.playerMemoryButtons
            
            Array.prototype.forEach.call(memory, (element) => {

                element.addEventListener("click", () => {
                if (playerMemory.classList.contains("playerActive")) {
                    startReactor.play(parseInt(element.dataset.memory))
                    console.log("O valor do elemento clicado ??: " + element.dataset.memory)

                    element.style.animation = "playermemoryClick .4s"
                    setTimeout(() => element.style.animation = "", 400)
                }
                })  

            })
        })


    },
    
    start() {
        // Criando a combina????o
        startReactor.computerCombination = startReactor.createCombination();
        
        // Zerando as Variaveis
        startReactor.computerCombinationPosition = 1;
        startReactor.playerCombination = [];

        // Dar Play na combina????o do computador
        startReactor.interface.start().then(() => {
            setTimeout(() => {
                startReactor.playCombination()
            }, 500)
        })
        

    },
    
    createCombination() {
        // Criando o array da combina????o
        let newCombination = [];

        // Pushando os valores no array
        for (let i = 0; i < startReactor.combinationMaxPosition; i++) {
            const position = Math.floor((Math.random() * startReactor.memoryMaxCombination) + 1)
            newCombination.push(position-1);
        }

        // Retornando o array
        return newCombination;
    },

    play(index) {
        startReactor.interface.playItem(index, startReactor.playerCombination.length, 'player')
        startReactor.playerCombination.push(index)

        if (startReactor.isTheRightCombination(startReactor.playerCombination.length)) {
            
            if (startReactor.playerCombination.length == startReactor.combinationMaxPosition) {
                startReactor.interface.endGame("complete")
                setTimeout(() => {
                    startReactor.start()
                }, 1200)
                return
            }

            if (startReactor.playerCombination.length == startReactor.computerCombinationPosition) {
                startReactor.computerCombinationPosition++
                setTimeout(() => {
                        startReactor.playCombination()
                }, 1200)
                return
            }

        } else {

            startReactor.interface.endGame("fail")
            document.getElementById("title").textContent = "Voc?? ?? o impostor"
            setTimeout(() => {
                document.getElementById("title").textContent = "START REACTOR"
                startReactor.start()
            }, 1400)
            return
        }
    },

    playCombination() {
        startReactor.playerCombination = []
        startReactor.interface.disableButtons()
        startReactor.interface.turnAllLedsOff()

        for (let i = 0; i <= startReactor.computerCombinationPosition - 1; i++){
            setTimeout(() => {
                startReactor.interface.playItem(startReactor.computerCombination[i], i)
            }, 400 * (i+1))
        }

        setTimeout(() => {
            startReactor.interface.turnAllLedsOff()
            startReactor.interface.enableButtons()
        }, 600 * startReactor.computerCombinationPosition)

    },
    
    isTheRightCombination(position) {
        let computerCombination = startReactor.computerCombination.slice(0, position)

        return ( computerCombination.toString() == startReactor.playerCombination.toString())
    },

}