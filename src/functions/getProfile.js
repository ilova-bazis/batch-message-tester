export default async function getProfile(reply){

    // let reply = JSON.parse(msg);
    if(reply.result !== undefined){
        return {profile: reply.result.profile}
    }
    // console.log(msg);
}
