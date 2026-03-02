import { action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// McDonald's menu data (simulated from FireCrawl)
const MCDONALDS_MENU = {
  burgers: [
    { name: "Big Mac", price: 5.99, calories: 550, description: "Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun" },
    { name: "Quarter Pounder with Cheese", price: 6.49, calories: 520, description: "Fresh beef patty with cheese, onions, pickles, mustard and ketchup" },
    { name: "McDouble", price: 3.49, calories: 400, description: "Two beef patties with cheese, pickles, onions, ketchup and mustard" },
    { name: "Double Cheeseburger", price: 3.79, calories: 450, description: "Two beef patties with two slices of cheese" },
    { name: "McChicken", price: 2.49, calories: 400, description: "Crispy chicken patty with mayo and shredded lettuce" },
  ],
  chicken: [
    { name: "10pc Chicken McNuggets", price: 5.99, calories: 420, description: "Crispy chicken nuggets with your choice of dipping sauce" },
    { name: "Crispy Chicken Sandwich", price: 5.49, calories: 470, description: "Crispy chicken fillet with pickles on a potato roll" },
    { name: "Spicy Chicken Sandwich", price: 5.69, calories: 530, description: "Spicy crispy chicken with pickles on a potato roll" },
  ],
  breakfast: [
    { name: "Egg McMuffin", price: 4.49, calories: 310, description: "Egg, Canadian bacon, and cheese on an English muffin" },
    { name: "Sausage McMuffin", price: 2.99, calories: 400, description: "Sausage patty with cheese on an English muffin" },
    { name: "Hotcakes", price: 4.29, calories: 580, description: "Three golden brown hotcakes with syrup and butter" },
  ],
  sides: [
    { name: "Medium Fries", price: 3.29, calories: 320, description: "Golden, crispy fries" },
    { name: "Large Fries", price: 3.79, calories: 480, description: "Golden, crispy fries - large portion" },
    { name: "Apple Slices", price: 1.49, calories: 15, description: "Fresh apple slices" },
  ],
  drinks: [
    { name: "Medium Soft Drink", price: 1.99, calories: 210, description: "Coca-Cola, Sprite, or Fanta" },
    { name: "Medium McCafe Coffee", price: 2.29, calories: 5, description: "Premium roast coffee" },
    { name: "McFlurry with Oreo", price: 3.99, calories: 510, description: "Creamy vanilla soft serve with Oreo cookie pieces" },
  ],
  value: [
    { name: "$1 Any Size Soft Drink", price: 1.00, calories: 210, description: "Any size fountain drink" },
    { name: "2 for $6 Mix & Match", price: 6.00, calories: 900, description: "Choose 2: Big Mac, 10pc Nuggets, Quarter Pounder, or Filet-O-Fish" },
  ],
};

// Friendly agent personality responses
const GREETINGS = [
  "Howdy, friend! 🍟 I'm your McHelper, and boy am I excited to help you find somethin' tasty today!",
  "Well hello there, sunshine! ☀️ Welcome to your friendly neighborhood McDonald's assistant!",
  "Hey hey hey! 🍔 Your pal McHelper here, ready to make your day a whole lot yummier!",
];

const THINKING_PHRASES = [
  "Let me think real hard about this one for ya...",
  "Ooh, great question! Lemme consult my burger brain...",
  "Hmm, let me check my mental menu here...",
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAgentResponse(userMessage: string, isFirstMessage: boolean): string {
  const lowerMessage = userMessage.toLowerCase();

  // First message greeting
  if (isFirstMessage) {
    return `${getRandomElement(GREETINGS)}

I've got the whole McDonald's menu memorized in this noggin of mine! Just tell me what you're cravin', any dietary needs you got, or your budget, and I'll whip up some delicious suggestions faster than you can say "I'm lovin' it!"

So whatcha in the mood for today, partner? 🤠`;
  }

  // Budget-related queries
  if (lowerMessage.includes("budget") || lowerMessage.includes("cheap") || lowerMessage.includes("$") || lowerMessage.includes("dollar") || lowerMessage.includes("value") || lowerMessage.includes("deal")) {
    return `Oh boy, do I have some FANTASTIC deals for ya! 💰

**Best Value Picks:**
• **$1 Any Size Soft Drink** - Can't beat a buck for refreshment!
• **McDouble ($3.49)** - Two patties! That's a whole lotta burger for the money!
• **2 for $6 Mix & Match** - Get TWO of the big items for just $6!

**My Budget Meal Suggestion:**
🍔 McDouble ($3.49) + 🍟 Medium Fries ($3.29) + 🥤 $1 Drink = **$7.78 total!**

That's a filling meal that won't empty your wallet, friend! Want me to customize this or find something else? I'm here to help! 😊`;
  }

  // Healthy options
  if (lowerMessage.includes("healthy") || lowerMessage.includes("diet") || lowerMessage.includes("calorie") || lowerMessage.includes("light") || lowerMessage.includes("low")) {
    return `Aw, lookin' to keep it light? I totally respect that! 🥗

**Lighter Options:**
• **Egg McMuffin** - Only 310 calories and packed with protein!
• **Apple Slices** - Just 15 calories of crispy goodness!
• **McChicken** - 400 calories, nice and reasonable!
• **McCafe Coffee** - Only 5 calories (black)!

**My Healthy-ish Combo Suggestion:**
🥚 Egg McMuffin (310 cal) + 🍎 Apple Slices (15 cal) + ☕ Coffee (5 cal) = **330 calories total!**

Not too shabby, right? You can enjoy McDonald's AND feel good about it! Want me to find other options? 😊`;
  }

  // Chicken preferences
  if (lowerMessage.includes("chicken") || lowerMessage.includes("nugget") || lowerMessage.includes("crispy")) {
    return `Ooooh, a chicken lover! Cluck yeah! 🐔

**Chicken Paradise:**
• **10pc Chicken McNuggets ($5.99)** - The classic! Crispy, dippy perfection!
• **Crispy Chicken Sandwich ($5.49)** - That crunch is *chef's kiss*!
• **Spicy Chicken Sandwich ($5.69)** - For when you want a little kick!
• **McChicken ($2.49)** - Simple, delicious, budget-friendly!

**My Chicken Combo Suggestion:**
🍗 10pc Nuggets ($5.99) + 🍟 Medium Fries ($3.29) + 🥤 Drink ($1.99) = **$11.27!**

Don't forget to grab your favorite dipping sauce! I'm partial to Sweet & Sour myself! What sounds good to ya? 😋`;
  }

  // Breakfast
  if (lowerMessage.includes("breakfast") || lowerMessage.includes("morning") || lowerMessage.includes("egg") || lowerMessage.includes("pancake") || lowerMessage.includes("hotcake")) {
    return `Rise and shine, early bird! 🌅 Breakfast is my FAVORITE!

**Morning Delights:**
• **Egg McMuffin ($4.49)** - The OG breakfast sandwich! So good!
• **Sausage McMuffin ($2.99)** - Savory sausage goodness!
• **Hotcakes ($4.29)** - Three fluffy pancakes with syrup!

**My Breakfast Combo Suggestion:**
🥚 Egg McMuffin ($4.49) + ☕ McCafe Coffee ($2.29) = **$6.78!**

Nothing starts the day better than a warm McMuffin and a hot cup of joe! Want hash browns with that? Just say the word! 🌞`;
  }

  // Hungry/big appetite
  if (lowerMessage.includes("hungry") || lowerMessage.includes("starving") || lowerMessage.includes("lot") || lowerMessage.includes("big") || lowerMessage.includes("feast")) {
    return `Someone's got a BIG appetite! I like it! 🦁

**Go Big or Go Home:**
• **Big Mac ($5.99)** - The LEGEND itself!
• **Quarter Pounder with Cheese ($6.49)** - Fresh beef, baby!
• **Double Cheeseburger ($3.79)** - Double the cheese, double the fun!

**My "Feed Me NOW" Combo:**
🍔 Big Mac ($5.99) + 🍟 Large Fries ($3.79) + 🥤 Medium Drink ($1.99) + 🍦 McFlurry ($3.99) = **$15.76!**

That's a FEAST fit for a champion! You'll be one happy camper after that meal! Ready to order? 😄`;
  }

  // Dessert/sweet
  if (lowerMessage.includes("dessert") || lowerMessage.includes("sweet") || lowerMessage.includes("ice cream") || lowerMessage.includes("mcflurry") || lowerMessage.includes("treat")) {
    return `Got a sweet tooth, huh? Say no more! 🍦

**Sweet Treats:**
• **McFlurry with Oreo ($3.99)** - Creamy vanilla with crunchy Oreo pieces!
• **McFlurry with M&M's ($3.99)** - Colorful and delicious!
• **Soft Serve Cone ($1.99)** - Classic and refreshing!

You deserve a treat, friend! Life's too short to skip dessert! 🎉

Want me to add this to a meal suggestion, or is it treat time only? 😊`;
  }

  // General menu/recommendation request
  if (lowerMessage.includes("menu") || lowerMessage.includes("what") || lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || lowerMessage.includes("order") || lowerMessage.includes("help")) {
    return `${getRandomElement(THINKING_PHRASES)}

Alrighty! Here are my TOP picks for ya today! 🌟

**If you want a classic:** Big Mac ($5.99) - You simply can't go wrong!
**If you're budget-conscious:** McDouble ($3.49) - Best bang for your buck!
**If you want chicken:** 10pc Nuggets ($5.99) - Crispy perfection!
**If you're health-minded:** Egg McMuffin ($4.49) - Protein-packed!

**My Personal Favorite Combo:**
🍔 Big Mac + 🍟 Medium Fries + 🥤 $1 Drink = **$10.28!**

Tell me more about what you like! Are you:
• 🐔 Team Chicken or 🐄 Team Beef?
• 💰 Watching your budget?
• 🏃 Trying to eat lighter?

I'm all ears (and hungry tummy)! 😄`;
  }

  // Default friendly response
  return `Aw shucks, I love chattin' with ya! 😊

${getRandomElement(THINKING_PHRASES)}

Here's what I'm thinkin' based on our chat:

**Today's McHelper Special Suggestion:**
🍔 Quarter Pounder with Cheese ($6.49)
🍟 Medium Fries ($3.29)
🥤 $1 Any Size Drink ($1.00)
**Total: $10.78**

This combo hits all the right spots - juicy fresh beef, crispy fries, and a refreshing drink!

But hey, I'm here to help YOU! Tell me:
• What flavors are you cravin'?
• Any allergies or no-nos I should know about?
• What's your budget lookin' like?

Let's find your perfect meal together, partner! 🤠`;
}

export const getRecommendation = action({
  args: {
    conversationId: v.id("conversations"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // Get existing messages to check if this is first message
    const messages = await ctx.runQuery(api.messages.list, {
      conversationId: args.conversationId
    });

    const isFirstMessage = messages.length === 0;

    // Generate friendly agent response
    const agentResponse = generateAgentResponse(args.userMessage, isFirstMessage);

    // Save the assistant's response
    await ctx.runMutation(api.messages.addAssistantMessage, {
      conversationId: args.conversationId,
      content: agentResponse,
    });

    return agentResponse;
  },
});

export const getMenuData = query({
  args: {},
  handler: async () => {
    return MCDONALDS_MENU;
  },
});
