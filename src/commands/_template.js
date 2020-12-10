module.exports = {
    name: '', // The name of the command. E.g. if the command was !register, this should be set to 'register'.
    description: '', // A brief description of the command.
    /**
     * Describe the function here.
     * @param {string} message - The Discord "Message" object. Read: https://discord.js.org/#/docs/main/master/class/Message
     * @param {array} args - An array of all arguments provided by the user in the command.
     */
    execute: async (message, args) => {},
};
