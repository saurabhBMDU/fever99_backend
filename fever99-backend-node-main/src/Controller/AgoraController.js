import pkg from 'agora-token';
const { RtcRole, RtcTokenBuilder } = pkg;


const appID = 'b671aeda83ee48d582e9cc33f83b30cb';
const appCertificate = 'f154355477c4435092cd391f1b7dba14';
const channelName = 'test';
const uid = 2882341273;
const account = '1077641';
const role = RtcRole.PUBLISHER;

const expirationTimeInSeconds = 153600;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

export const GenerateToken = async (req, res) => {
    // console.log(appID, appCertificate, req.body.channelName, req.body.uid, RtcRole.PUBLISHER, privilegeExpiredTs, "appID, appCertificate, req.body.channelName, Math.random(), role, privilegeExpiredTs")
    const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, req.body.channelName, req.body.uid, RtcRole.PUBLISHER, privilegeExpiredTs);
    res.json({tokenA: tokenA, status: true, message: 'Video Call Token'})
}