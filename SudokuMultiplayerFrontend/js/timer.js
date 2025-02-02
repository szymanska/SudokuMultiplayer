
class Timer {
    constructor(render) {
        this.render = render
        this.t = {}
        this.time = {
            minute: 0,
            second: 0,
        }
        this.tickTock = () => {
            this.time.second++
            if (this.time.second == 60) {
                this.time.minute++
                this.time.second = 0
            }
            this.render([
                this.time.minute.toString().padStart(2, '0'),
                ':',
                this.time.second.toString().padStart(2, '0'),
            ].join(''))
        }
        this.start = (offset) => {
            this.stop()
            this.time.minute = parseInt(offset / 1000 / 60)
            this.time.second = parseInt(offset / 1000) % 60
            this.t = setInterval(this.tickTock, 1000)
        }
        this.stop = () => {
            clearInterval(this.t)
        }
    }
}
