<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Cookies Policy</h1>

    <div class="bg-white rounded-lg shadow p-6 space-y-8">
      <!-- Introduction -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">What Are Cookies</h2>
        <p class="text-gray-600 leading-relaxed">
          Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
          They are widely used to make websites work more efficiently and provide a better user experience.
        </p>
      </section>

      <!-- Types of Cookies -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-xl font-medium mb-2">Essential Cookies</h3>
            <p class="text-gray-600">
              These cookies are necessary for the website to function properly. They enable core functionality such as user authentication and security. 
              You cannot opt out of these cookies.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-medium mb-2">Preference Cookies</h3>
            <p class="text-gray-600">
              These cookies remember your preferences and settings (like dark/light mode, units of measurement) to enhance your experience.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-medium mb-2">Analytics Cookies</h3>
            <p class="text-gray-600">
              We use analytics cookies to understand how visitors interact with our website, helping us improve our services.
            </p>
          </div>
        </div>
      </section>

      <!-- Cookie Usage -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">How We Use Cookies</h2>
        <ul class="list-disc list-inside space-y-2 text-gray-600">
          <li>Authentication and security</li>
          <li>Remembering your preferences</li>
          <li>Analyzing website performance</li>
          <li>Improving user experience</li>
          <li>Session management</li>
        </ul>
      </section>

      <!-- Managing Cookies -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Managing Cookies</h2>
        <p class="text-gray-600 mb-4">
          You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
          and you can set most browsers to prevent them from being placed.
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium mb-2">Browser Settings</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
            </li>
            <li>
              <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
            </li>
            <li>
              <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
            </li>
            <li>
              <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies
            </li>
          </ul>
        </div>
      </section>

      <!-- Your Choices -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Your Choices</h2>
        <div class="space-y-4">
          <button 
            @click="openCookieSettings"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Manage Cookie Preferences
          </button>
          <p class="text-gray-600">
            Note: Blocking some types of cookies may impact your experience of our website.
          </p>
        </div>
      </section>

      <!-- Updates -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Updates to This Policy</h2>
        <p class="text-gray-600">
          We may update this Cookie Policy from time to time. The latest version will always be available on this page.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const openCookieSettings = () => {
  // This will be implemented when we add the cookie consent manager
  console.log('Opening cookie settings...')
}
</script> 