import Konva from 'konva'
import EventEmitter from 'eventemitter3'
import dayjs from 'dayjs'

export class VideoTime extends EventEmitter {
    container: HTMLDivElement
    stage: Konva.Stage
    layer: Konva.Layer

    width: number
    height: number

    currentTime: number = Date.now()
    hours: number = 24
    isSpliter: boolean = false

    tooltip: any
    moveTooltip: any

    videoChunkGroup: Konva.Group | any

    mouseDown: boolean = false
    isMove: boolean = false
    mouseDownPosition: number = 0
    mouseDownCurrentTime: number = 0
    timeChunks: number[][] = []

    selectionRect: any
    selectionChunkInfo: any

    constructor(container: HTMLDivElement) {
        super()
        this.container = container
        this.width = container.offsetWidth
        this.height = container.offsetHeight
        this.stage = new Konva.Stage({
            container: this.container,
            width: this.width,
            height: this.height
        })
        this.layer = new Konva.Layer({
            container: this.container
        })

        this.stage.add(this.layer)

        this.drawBackGround()
        this.drawLines()
        this.drawIndicator()

        this.selectionRect = new Konva.Rect({
            visible: false,
            stroke: '#FFC92D',
            strokeWidth: 2,
            height: 14,
            fill: 'rgba(65, 168, 237, 0.2)',
            draggable: true,
            listening: false,
            dragBoundFunc: (pos) => {
                return { x: pos.x, y: this.stage.height() - 16 }
            }
        })

        this.layer.add(this.selectionRect)

        this.stage.on('mousedown', (e) => {
            this.mouseDown = true
            this.mouseDownPosition = e.evt.offsetX
            this.mouseDownCurrentTime = this.currentTime

            if (this.isSpliter) {
                let index = this.chunkIndex(this.mouseDownPosition)
                this.selectionChunkInfo = index !== -1 ? this.videoChunkGroup.children[index] : null
                if (!this.selectionChunkInfo) {
                    this.mouseDown = false
                    return
                }

                if (!this.selectionRect.visible()) {
                    this.selectionRect.visible(true)
                }
                this.selectionRect.width(0)
                this.selectionRect.position({ x: this.mouseDownPosition, y: this.stage.height() - 16 })

                const mouseup = () => {
                    this.mouseDown = false
                    let startTime = this.selectionRect.x() * this.pxToSecond * 1000 + this.firstTime
                    let endTime = Math.abs(this.selectionRect.x() + this.selectionRect.width() * this.pxToSecond * 1000) + startTime
                    let index = this.chunkIndex(this.selectionRect.x())
                    this.emit('selected', {
                        index,
                        startTime: Math.fround(startTime),
                        endTime: Math.fround(endTime),
                        rangeTime: this.timeChunks[index]
                    })
                    document.removeEventListener('mouseup', mouseup)
                }

                document.addEventListener('mouseup', mouseup)

                return
            }

            const mouseup = () => {
                if (this.isMove) {
                    this.tooltip.getText().visible(false)
                    this.tooltip.getTag().visible(false)
                    // 当鼠标拖拽停止时
                    let date = (this.stage.width() / 2) * this.pxToSecond * 1000 + this.firstTime
                    const index = this.chunkIndex(this.stage.width() / 2)
                    this.setTime(date)
                    this.emit('change', {
                        index,
                        date,
                        seekValue: index >= 0 ? parseFloat(((date - this.timeChunks[index][0]) / 1000).toFixed(5)) : 0
                    })
                } else {
                    // 单机停止时
                    const index = this.chunkIndex(e.evt.offsetX)
                    const date = e.evt.offsetX * this.pxToSecond * 1000 + this.firstTime
                    this.setTime(date)
                    this.emit('change', {
                        index,
                        date,
                        seekValue: index >= 0 ? parseFloat(((date - this.timeChunks[index][0]) / 1000).toFixed(5)) : 0
                    })
                }
                this.mouseDown = this.isMove = false
                document.removeEventListener('mouseup', mouseup)
            }
            document.addEventListener('mouseup', mouseup)
        })

        this.stage.on('mousemove', (e) => {
            if (this.isSpliter && this.selectionRect.visible()) {
                if (this.mouseDown) {
                    let width = e.evt.offsetX - this.mouseDownPosition
                    let left = this.selectionChunkInfo.attrs.data.x
                    let right = left + this.selectionChunkInfo.attrs.data.width
                    if (e.evt.offsetX >= right) {
                        width = right - this.mouseDownPosition
                    } else if (e.evt.offsetX <= left) {
                        width = left - this.mouseDownPosition
                    }

                    this.selectionRect.width(width)
                }
                return
            }

            this.tooltip.getTag().fill(this.chunkIndex(this.tooltip.x() + this.tooltip.width() / 2) >= 0 ? '#00D9FF' : '#A8ADB4')
            // 鼠标按一下移动
            if (this.mouseDown) {
                this.isMove = true
                let offset = this.mouseDownPosition - e.evt.offsetX
                let date = this.mouseDownCurrentTime + offset * this.pxToSecond * 1000
                let dateText = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
                this.moveTooltip.visible(false)
                this.tooltip.getText().text(dateText)
                this.tooltip.getText().visible(true)
                this.tooltip.getTag().visible(true)
                this.currentTime = date
                return
            }

            // 鼠标移入
            this.moveTooltip.visible(true)
            let date = e.evt.offsetX * this.pxToSecond * 1000 + this.firstTime
            const text = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
            this.moveTooltip.getText().text(text)
            this.moveTooltip.position({ x: e.evt.offsetX - this.moveTooltip.width() / 2, y: 0 })
            this.moveTooltip
                .getTag()
                .fill(this.chunkIndex(this.moveTooltip.x() + this.moveTooltip.width() / 2) >= 0 ? '#00D9FF' : '#A8ADB4')
        })

        this.stage.on('mouseenter', () => {
            this.tooltip.getText().visible(false)
            this.tooltip.getTag().visible(false)
            if (this.isSpliter) return
            this.moveTooltip.visible(true)
        })

        this.stage.on('mouseleave', () => {
            this.moveTooltip.visible(false)
            this.tooltip.getText().visible(false)
            this.tooltip.getTag().visible(false)
        })

        this.stage.on('wheel', (e) => {
            const h = this.hours + (e.evt.deltaY > 0 ? 1 : -1)
            this.hours = h <= 1 ? 1 : h >= 24 ? 24 : h
            this.layer.drawScene()
        })
    }

    resize({ width, height }: any) {
        this.width = width
        this.height = height
        this.stage.width(width)
        this.stage.height(height)
        this.layer.drawScene()
        this.tooltip.position({ x: this.width / 2 - this.tooltip.width() / 2, y: 0 })
    }

    get pxToSecond() {
        let second = (this.hours * 60 * 60) / this.width
        let minPxSecond = 65
        if (second > minPxSecond) second = minPxSecond
        return second
    }

    get firstTime() {
        return this.currentTime - ((this.pxToSecond * this.width) / 2) * 1000
    }

    get firstLineTime() {
        const start = dayjs(this.currentTime - ((this.pxToSecond * this.width) / 2) * 1000)
        const remainder = this.scaleLine_minute - (start.minute() % this.scaleLine_minute)
        return +start.add(remainder, 'minutes').format('x')
    }

    get scaleLine_minute() {
        if (this.hours >= 20) {
            return 60
        }
        if (this.hours >= 16) {
            return 50
        }
        if (this.hours >= 12) {
            return 40
        }
        if (this.hours >= 8) {
            return 30
        }
        if (this.hours >= 2) {
            return 20
        }
        return 5
    }

    drawBackGround() {
        const rect = new Konva.Rect({
            fill: '#34a1cb',
            sceneFunc: (context, shape) => {
                context.fillStyle = shape.fill()
                context.fillRect(0, 8, this.width, this.height)
            }
        })

        this.layer.add(rect)
    }

    drawLines() {
        const line = new Konva.Line({
            x: 0,
            y: 8,
            sceneFunc: (context, shape) => {
                let time = this.firstLineTime - this.firstTime
                let p = time / 1000 / this.pxToSecond
                let line_px = (this.scaleLine_minute * 60) / this.pxToSecond
                context.beginPath()
                context.font = `12px sans-serif`
                context.fillStyle = '#ffffff'
                context.textAlign = 'center'
                context.strokeStyle = '#ffffff'
                context.lineWidth = 1
                for (let i = p; i <= this.width; i += line_px) {
                    let date = this.firstTime + i * this.pxToSecond * 1000
                    let text = dayjs(date).format('HH:mm')

                    context.moveTo(i, 0)
                    context.lineTo(i, 10)

                    context.fillText(text, i + 2, 18)
                }

                context.stroke()
                context.closePath()
                context.fillStrokeShape(shape)
            }
        })

        this.layer.add(line)
    }

    drawTimeChunk(timeChunks: number[][]) {
        this.videoChunkGroup?.remove()
        this.videoChunkGroup = new Konva.Group()
        this.layer.add(this.videoChunkGroup)
        this.videoChunkGroup.moveToBottom()
        this.videoChunkGroup.moveUp()

        this.timeChunks = timeChunks
        timeChunks?.forEach(([beginTime, endTime]) => {
            this.videoChunkGroup.add(
                new Konva.Shape({
                    sceneFunc: (context, shape) => {
                        const firstTime = this.currentTime - ((this.pxToSecond * this.width) / 2) * 1000
                        const sx = (beginTime - firstTime) / 1000 / this.pxToSecond
                        const ex = (endTime - firstTime) / 1000 / this.pxToSecond
                        const data = {
                            x: sx,
                            y: this.stage.height() - 16,
                            width: ex - sx,
                            height: 14
                        }
                        shape.setAttrs({ data })
                        context.fillStyle = '#4BA7E4'
                        context.strokeStyle = '#D3D9E2'
                        context.strokeRect(data.x, data.y, data.width, data.height)
                        context.fillRect(data.x, data.y, data.width, data.height)
                    }
                })
            )
        })
    }

    drawIndicator() {
        const tooltip = new Konva.Label({
            x: 0,
            y: 0,
            opacity: 0.75,
            visible: true
        })

        tooltip.add(
            new Konva.Tag({
                fill: '#4c8e1f',
                // shadowColor: 'rgba(107, 145, 222, 1)',
                // shadowOffsetX: 0,
                // shadowOffsetY: 0,
                // shadowBlur: 2,
                cornerRadius: 3,
                visible: false
            }),
            new Konva.Text({
                text: '2024-01-18. 15:32:00',
                fontSize: 16,
                padding: 5,
                fill: '#FFFFFF',
                align: 'center',
                height: 25,
                visible: false
            }),
            new Konva.Line({
                sceneFunc: (context, shape) => {
                    context.beginPath()
                    context.font = `14px sans-serif`
                    context.textAlign = 'left'
                    context.strokeStyle = '#ffffff'
                    context.lineWidth = 1
                    context.moveTo(tooltip.width() / 2 + 0.5, tooltip.getTag().visible() ? 16 : 8)
                    context.lineTo(tooltip.width() / 2 + 0.5, this.stage.height())
                    context.stroke()
                    context.closePath()
                    context.fillStrokeShape(shape)
                }
            })
        )

        tooltip.position({ x: this.width / 2 - tooltip.width() / 2, y: 100 })

        this.moveTooltip = tooltip.clone()
        this.tooltip = tooltip

        this.layer.add(tooltip, this.moveTooltip)
        this.moveTooltip.visible(false)
        this.moveTooltip.getText().visible(true)
        this.moveTooltip.getTag().visible(true)
    }

    setTime(v: number) {
        this.currentTime = v
        let dateText = dayjs(this.currentTime).format('YYYY-MM-DD HH:mm:ss')
        this.tooltip.getText().text(dateText)
        this.layer.draw()
    }

    setCurrentTime(v: number) {
        if (this.mouseDown) {
            return
        }

        this.setTime(v)
        this.tooltip.getTag().fill(this.chunkIndex(this.tooltip.x() + this.tooltip.width() / 2) >= 0 ? '#00D9FF' : '#A8ADB4')
    }

    seekTime(v: number) {
        this.setTime(v)
        let date = (this.stage.width() / 2) * this.pxToSecond * 1000 + this.firstTime
        const index = this.chunkIndex(this.stage.width() / 2)
        this.emit('change', { index, date, seekValue: index >= 0 ? parseFloat(((date - this.timeChunks[index][0]) / 1000).toFixed(5)) : 0 })
    }

    startSureCut(isSpliter: boolean) {
        this.selectionRect.visible(false)
        this.isSpliter = isSpliter
    }

    chunkIndex(x: number) {
        if (!this.videoChunkGroup || !this.videoChunkGroup.children.length) {
            return -1
        }
        for (let i = 0; i < this.videoChunkGroup.children.length; i++) {
            const attrs = this.videoChunkGroup.children[i].attrs.data
            if (this.isBetween(x, attrs.x, attrs.x + attrs.width)) {
                return i
            }
        }
        return -1
    }

    isBetween(n: number, a: number, b: number) {
        return n >= a && n <= b
    }
}
