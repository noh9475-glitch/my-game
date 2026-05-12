import Phaser from 'phaser'
import './style.css'

class BlackRoomScene extends Phaser.Scene {
  constructor() {
    super('BlackRoomScene')
  }

  create() {
    const { width, height } = this.scale

    this.cameras.main.setBackgroundColor('#050507')

    this.add.text(width / 2, 54, 'The Black Room', {
      color: '#f3f3f7',
      fontFamily: 'Arial, sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(width / 2, 92, 'Move with WASD or arrow keys', {
      color: '#858899',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
    }).setOrigin(0.5)

    this.room = this.add.rectangle(width / 2, height / 2 + 24, 640, 360, 0x08090d)
    this.room.setStrokeStyle(2, 0x232532)

    this.player = this.add.rectangle(width / 2, height / 2 + 24, 34, 34, 0xffffff)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    this.physics.world.setBounds(
      this.room.x - this.room.width / 2 + 17,
      this.room.y - this.room.height / 2 + 17,
      this.room.width - 34,
      this.room.height - 34,
    )

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys('W,A,S,D')
  }

  update() {
    const speed = 230
    const body = this.player.body

    body.setVelocity(0)

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      body.setVelocityX(-speed)
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      body.setVelocityX(speed)
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      body.setVelocityY(-speed)
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      body.setVelocityY(speed)
    }

    body.velocity.normalize().scale(speed)
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 960,
  height: 600,
  backgroundColor: '#050507',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: BlackRoomScene,
})
