<template>
  <div class="payment-success-container">
    <div class="success-card">
      <h1 class="title">🎉 Congratulations!</h1>
      <p class="message">Your payment was successfully processed. Your appointment is now confirmed.</p>
      <p class="details">The meeting is scheduled and you can join later using the link below:</p>
      <div class="meeting-link-container">
        <a :href="meetingLink" target="_blank" class="meeting-link-btn">Join Appointment</a>
      </div>
      <!-- <p class="details">Use the password below to join the meeting:</p>
      <div class="meeting-password-container">
        <span class="meeting-password">{{ meetingPassword }}</span>
      </div> -->
      <p class="footer-text">See you at your appointment!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute();
  const meetingLink = ref(route.query.meeting_link || '');
  const meetingPassword = ref(route.query.meeting_password || '');

  onMounted(() => {
    // You can use the appointment ID here for additional logic if needed
    console.log('Appointment ID:', route.query.appointment_id);
  });
</script>

<style scoped>
  .payment-success-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f7fc;
  }

  .success-card {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 30px;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .title {
    font-size: 2rem;
    color: #4caf50;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .message {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 10px;
  }

  .details {
    font-size: 1rem;
    color: #555;
    margin-bottom: 20px;
  }

  .meeting-link-container {
    margin-bottom: 20px;
  }

  .meeting-link-btn {
    font-size: 1.1rem;
    background-color: #007bff;
    color: #fff;
    padding: 12px 24px;
    border-radius: 50px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }

  .meeting-link-btn:hover {
    background-color: #0056b3;
  }

  .meeting-password-container {
    margin-top: 20px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }

  .footer-text {
    font-size: 0.9rem;
    color: #888;
  }
</style>
