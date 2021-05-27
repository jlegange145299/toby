import React, { Component } from 'react';
import Phaser from 'phaser';
import './App.css';

var game;
var balloonCount = 3;

class GameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
    }

    //this.create = this.create.bind(this);
  }

  preload() {
    this.load.image('background', './phaser/Background.png');
    //this.load.image('balloon', './phaser/Balloon Pop.png');
    this.load.spritesheet('balloon',
      './phaser/Balloon Pop.png',
      { frameWidth: 390, frameHeight: 481 }
    );
    this.load.image('cloudBack', './phaser/Clouds_03_Back.png');
    this.load.image('cloudMid', './phaser/Clouds_02_Middle.png');
    this.load.image('cloudFront', './phaser/Clouds_01_Front.png');
  }

  create() {
    //console.log(game);
    //game.stage.backgroundColor = "#4488AA";



    let bg = this.add.sprite(0, 0, 'background');
    bg.displayWidth = window.innerWidth;
    bg.displayHeight = window.innerHeight;
    bg.setOrigin(0, 0);

    this.cloudBack = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, 'cloudBack');
    this.cloudBack.setScale(1);
    this.cloudBack.tileScaleX = 0.5;
    this.cloudBack.tileScaleY = 0.6;

    this.cloudMid = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, 'cloudMid');
    this.cloudMid.setScale(1);
    this.cloudMid.tileScaleX = 0.5;
    this.cloudMid.tileScaleY = 0.6;

    this.cloudFront = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, 'cloudFront');
    this.cloudFront.setScale(1);
    this.cloudFront.tileScaleX = 0.5;
    this.cloudFront.tileScaleY = 0.6;

    let balloons = [];

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('balloon', { start: 0, end: 0 }),
      frameRate: 64
      //repeat: -1
    });

    this.anims.create({
      key: 'pop',
      frames: this.anims.generateFrameNumbers('balloon', { start: 0, end: 16 }),
      frameRate: 96
      //repeat: -1
    });

    for (let i = 0; i < balloonCount; i++) {
      let balloon = this.physics.add.sprite(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 'balloon').setInteractive();
      balloons.push(balloon);
      balloons[i].displayWidth = 140;
      balloons[i].displayHeight = 200;

      let speedX = 400 + Math.random() * 200;
      let speedY = 300 + Math.random() * 200;
      balloons[i].body.maxVelocity = { x: speedX, y: speedY };
      balloons[i].setBounce(1);
      balloons[i].setCollideWorldBounds(true);
      balloons[i].body.setGravityY(50+i*10);

      var velocityFromRotation = this.physics.velocityFromRotation;
      var velocity = new Phaser.Math.Vector2();
      balloons[i].setVelocity(speedX, speedY);
      balloons[i].body.angularVelocity = 250 + Math.random() * 100;
      balloons[i].body.angularDrag = 0;
      balloons[i].on('pointerdown', function () {
        if (game.started) {
          game.clickBalloon();
        }
        balloons[i].anims.play("pop", true);
        balloons[i].on('animationcomplete', (animation, frame) => {
          if (animation.key == "pop") {
            balloons[i].x = Math.random() * window.innerWidth;
            balloons[i].y = 100;
            balloons[i].anims.play("idle", true);
          }
        }, this);
      });
    }
  }


  update() {
    this.cloudBack.tilePositionX -= 0.15;
    this.cloudMid.tilePositionX += 0.3;
    this.cloudFront.tilePositionX -= 0.75;
  }


  componentWillReceiveProps(nextProps) {
    game.clickBalloon = nextProps.clickBalloon;
    game.started = nextProps.gameStarted;
  }

  componentDidMount() {
    let gameScene = new Phaser.Scene(game);
    var config = {
      type: Phaser.AUTO,
      parent: 'phaser-parent',
      pixelArt: false,
      backgroundColor: 'rgba(176, 55, 110,0.5)',
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
          debug: false
        }
      },
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
      }
    };
    game = new Phaser.Game(config);
    console.log(game)
    game.clickBalloon = this.props.clickBalloon;
    game.started = this.props.gameStarted;
  }


  render() {
    return (
      <section id="phaser-parent">
      </section>
    );
  }
}

export default GameScreen;
