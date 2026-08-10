import { createApp } from "vue";
import App from "#/App.vue";

async function main() {
  try {
    createApp(App).mount("#app");
  } catch (error) {
    console.error("❌ Failed to initialize client:", error);
  }
}

main();
