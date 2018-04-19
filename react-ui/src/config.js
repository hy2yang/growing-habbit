export const PORT_EXPRESS = process.env.PORT || 2666;

export const REGEX = {
    USERNAME: /^(?=.{4,20}$)[A-Za-z0-9]+(?:[_.][A-Za-z0-9]+)*$/,
    PW: /.*[A-Za-z0-9]{4,20}$/ 
};