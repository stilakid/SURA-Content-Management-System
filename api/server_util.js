export default class Util {
    constructor() {
    }

    static dataDir = "../data";
    static mediaDir = `${Util.dataDir}/media`;
    static webpageDir = `${Util.dataDir}/webpages`;
    static mongoDBDir = `${Util.dataDir}/database/MongoDB`;

    print_error_message_header() {
        console.log("\n");
        console.log("#######################################");
        console.log("ERROR MESSAGE STARTS HERE");
        console.log("#######################################");
        console.log("\n");
    }

    print_error_message_footer() {
        console.log("\n");
        console.log("#######################################");
        console.log("ERROR MESSAGE ENDS HERE");
        console.log("#######################################");
        console.log("\n");
    }
}