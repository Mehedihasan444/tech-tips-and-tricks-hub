"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNickname = void 0;
const generateNickname = (name) => {
    const prefixes = ["Cool", "Super", "Mighty", "Lil", "Big", "Mega", "Tiny", "Crazy"];
    const suffixes = ["ster", "inator", "zilla", "master", "whiz", "rocket", "ninja", "wizard"];
    // Generate random prefix and suffix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    // Use part of the original name, and combine it with prefix and suffix
    const baseName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(); // Capitalize the first letter
    return `@${prefix}${baseName}${suffix}`;
};
exports.generateNickname = generateNickname;
