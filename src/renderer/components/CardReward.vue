<template>
	<div class="main">
		<div class="grid">
			<div class="projects">
				<div class="project ani0">
					<div class="mask">
						<div class="back">7</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="project ani1">
					<div class="mask">
						<div class="back">1</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="project ani2">
					<div class="mask">
						<div class="back">5</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="project ani3">
					<div class="mask">
						<div class="back">4</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="project ani4">
					<div class="mask">
						<div class="back">3</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="project ani5">
					<div class="mask">
						<div class="back">8</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="project ani6">
					<div class="mask">
						<div class="back">6</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="project ani7">
					<div class="mask">
						<div class="back">2</div>
						<div class="front"><span></span></div>
					</div>
				</div>
				<div class="aniwz ">
					<div class="text">抽奖<br>游戏</div>
				</div>
				<div class="controls">
					<span class="bottom"></span>
					<span class="bottom"></span>
					<span class="bottom"></span>
					<div class="mask">
						<div class="text start"><span>开</span><span>始</span></div>
					</div>
				</div>
			</div>
		</div>



	</div>
</template>

<script>
	import bgaudio from '@/assets/before.mp3';
	export default {
		computed: {
			user() {
				return this.$store.state.user.data;
			}
		},
		data() {
			return {

			};
		},
		created() {

		},
		methods: {


		}
	};
</script>

<style lang="scss" scoped>
	.main {
		background-color: #ef4036;
		overflow: hidden;
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		height: 100%;
	}

	.project {
		position: absolute;
		right: 0;
		bottom: 0;
		margin: 0 0 15px 15px;
	}

	.project {
		float: left;
		width: 222px;
		height: 311px;
	}

	.grid {
		width: 1170px;
		margin: 0 auto;
		position: relative;
	}

	.projects {
		float: left;
		width: 100%;
		position: relative;
		left: 0;
		top: 0;

		.controls {
			position: absolute;
			right: 0;
			bottom: 15px;
			float: left;
			width: 222px;
			height: 311px;
		}
	}

	.controls .mask:hover,
	.project:hover {
		cursor: pointer;
	}

	.controls .mask {
		float: left;
		position: relative;
		background: url('../assets/card/project_card_bg.png') no-repeat;
		width: 100%;
		height: 100%;
		overflow: hidden;
		text-align: center;
		font-size: 32px;
	}

	.projects .controls .bottom {
		-webkit-transition: all .3s ease;
		-moz-transition: all .3s ease;
		-o-transition: all .3s ease;
		-ms-transition: all .3s ease;
		transition: all .3s ease;
	}

	.projects .controls .bottom {
		background: url('../assets/card/project_card_bot_bg.png') no-repeat;
		position: absolute;
		bottom: -9px;
		right: 0;
		width: 222px;
		height: 66px;
	}

	.projects .controls .bottom+.bottom+.bottom {
		bottom: -3px;
	}

	.projects .controls .bottom+.bottom {
		bottom: -6px;
	}

	.projects .controls:hover .bottom+.bottom+.bottom {
		bottom: -8px;
	}

	.projects .controls:hover .bottom+.bottom {
		bottom: -14px;
	}

	.projects .controls:hover .bottom {
		bottom: -20px;
	}

	.project.ani0 {
		right: 948px;
		bottom: 326px;
	}

	.project.ani1 {
		right: 711px;
		bottom: 326px;
	}

	.project.ani2 {
		right: 474px;
		bottom: 326px;
	}

	.project.ani3 {
		right: 237px;
		bottom: 326px;
	}

	.project.ani4 {
		right: 948px;
		bottom: 0;
	}

	.project.ani5 {
		right: 711px;
		bottom: 0;
	}

	.project.ani6 {
		right: 474px;
		bottom: 0;
	}

	.project.ani7 {
		right: 237px;
		bottom: 0;
	}
	
	.project span{display: inline-block;border-radius: 50%;width: 160px;height: 160px;margin-top: 75px;}
	.project.ani0 span{background: #ef4036;}
	.project.ani1 span{background: #ff6c00;}
	.project.ani2 span{background: #ffde00;}
	.project.ani3 span{background: #0ce501;}
	.project.ani4 span{background: #05e7df;}
	.project.ani5 span{background: #007df1;}
	.project.ani6 span{background: #8e00f1;}
	.project.ani7 span{background: #000000;}
	
	.aniwz {
	    width: 222px;
	    height: 311px;
	    position: absolute;
	    right: 0;
	    bottom: 326px;
	    margin: 0 0 15px 15px;
	    text-align: center;
	    font-size: 32px;
	}
	.text{padding-top: 110px;}
	.start{padding-top: 130px;}
	.project .front {
	    background: url('../assets/card/project_front_bg.png') no-repeat;
	    display: table;
	}
	.project .back, .project .front {
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	}
	.project .back {
	    background: url('../assets/card/project_back_bg.png') no-repeat;
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: -webkit-flex;
	    display: flex;
	    -webkit-box-pack: center;
	    -ms-flex-pack: center;
	    -webkit-justify-content: center;
	    justify-content: center;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    -webkit-align-items: center;
	    align-items: center;
	    color: #fff;
	    font-size: 42px;
	}
	.project .back, .project .front {
	    position: absolute;
	    left: 0;
	    top: 0;
	    width: 222px;
	    height: 311px;
	    padding: 0 16px;
	    text-align: center;
	}
	
	.project, .project .back, .project .front, .socials a, .transform_holder .back, .transform_holder .front, .transform_holder .transform {
	    -webkit-transition: all 1s cubic-bezier(0.68,-.55,.265,1.55);
	    -moz-transition: all 1s cubic-bezier(0.68,-.55,.265,1.55);
	    -o-transition: all 1s cubic-bezier(0.68,-.55,.265,1.55);
	    -ms-transition: all 1s cubic-bezier(0.68,-.55,.265,1.55);
	    transition: all 1s cubic-bezier(0.68,-.55,.265,1.55);
	}
	.project {
	    -webkit-perspective: 1000;
	    -moz-perspective: 1000;
	    -o-perspective: 1000;
	    perspective: 1000;
	    -ms-transform: perspective(1000px);
	    -moz-transform: perspective(1000px);
	    -ms-transform-style: preserve-3d;
	    -moz-transform-style: preserve-3d;
	}
	.project .back, .project .front {
	    -webkit-backface-visibility: hidden;
	    -moz-backface-visibility: hidden;
	    -o-backface-visibility: hidden;
	    -ms-backface-visibility: hidden;
	    backface-visibility: hidden;
	    -webkit-transform-style: preserve-3d;
	    -moz-transform-style: preserve-3d;
	    -o-transform-style: preserve-3d;
	    -ms-transform-style: preserve-3d;
	    transform-style: preserve-3d;
	}
	
	.project .front {
	    -webkit-transform: rotateY(0deg);
	    -ms-transform: rotateY(0deg);
	}
	 .project .back {
	    -webkit-transform: rotateY(180deg);
	    -moz-transform: rotateY(180deg);
	    -o-transform: rotateY(180deg);
	    -ms-transform: rotateY(180deg);
	    transform: rotateY(180deg);
	}
	.project.hover .front, .project.showli .front {
	    -webkit-transform: rotateY(180deg);
	    -moz-transform: rotateY(180deg);
	    -o-transform: rotateY(180deg);
	    transform: rotateY(180deg);
	}
	.project.hover .back, .project.showli .back {
	    -webkit-transform: rotateY(0deg);
	    -moz-transform: rotateY(0deg);
	    -o-transform: rotateY(0deg);
	    -ms-transform: rotateY(0deg);
	    transform: rotateY(0deg);
	}
</style>