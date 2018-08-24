<template>
	<div class="error-container">
		<!-- <span>RFID: {{rfid}}</span> -->
		<section class="error-photo-container">

			<div class="error-info">
				<div class="info-left">
					<div class="info-left-top"></div>
					<div class="info-left-bottom"></div>
					
				</div>
				<div class="info-right"></div>
			</div>

			<!-- carousel for display the photos-->

			<div class="error-photo-wrapper">
				<div class="error-photo-carousel">
				</div>
				<div class="error-photo-pagination">
					<span class = "pagination-icon-up pagination-icon"></span>
					<span class = "page-number">0</span>
					<span class = "page-spot">/</span>
					<span class = "page-number">0</span>
					<span class = "pagination-icon-down pagination-icon"></span>
				</div>
				
			</div>

			<div class="error-size-option">
				<div class="size-left"></div>
				<div class="size-right"></div>
			</div>

		</section>

		<section class="error-description">
			<div class="error-image"></div>
			<div class="description-content-wrapper">
				<div class="description-content-word">
					<p>OOPS!</p>
					<p>The product information seems missing.</p>
					<p>Please try later or call our teammates to help you.</p>
				</div>
				<p class="back-index">Back to Index in {{countdown}}s</p>
			</div>

	  </section>	
	</div>
</template>

<script src="./error.js"></script>
<style type="text/css" src="./error.css"></style>