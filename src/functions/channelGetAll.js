export default async function channelsGetAll(reply){

    // let reply = JSON.parse(msg);
    if(reply.result !== undefined){
        return {conversations: reply.result.conversation}
    }
    // console.log(msg);
}
