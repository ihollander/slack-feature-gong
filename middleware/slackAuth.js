const crypto = require("crypto");
const timingSafeCompare = require("tsscmp");

const slackAuth = (req, res, next) => {
  const { headers, rawBody: body } = req;

  const requestSignature = headers["x-slack-signature"];
  const requestTimestamp = headers["x-slack-request-timestamp"];

  try {
    verifyRequestSignature({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      requestSignature,
      requestTimestamp,
      body
    });
    next();
  } catch (err) {
    res.end();
  }
};

const verifyRequestSignature = ({
  signingSecret,
  requestSignature,
  requestTimestamp,
  body
}) => {
  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;

  if (requestTimestamp < fiveMinutesAgo) {
    console.log("request is older than 5 minutes");
    const error = new Error("Slack request signing verification outdated");
    // error.code = errorCodes.REQUEST_TIME_FAILURE;
    throw error;
  }

  const hmac = crypto.createHmac("sha256", signingSecret);
  const [version, hash] = requestSignature.split("=");
  hmac.update(`${version}:${requestTimestamp}:${body}`);

  if (!timingSafeCompare(hash, hmac.digest("hex"))) {
    console.log("request signature is not valid");
    const error = new Error("Slack request signing verification failed");
    // error.code = errorCodes.SIGNATURE_VERIFICATION_FAILURE;
    throw error;
  }

  console.log("request signing verification success");
  return true;
};

module.exports = slackAuth;
