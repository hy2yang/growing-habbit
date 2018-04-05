module.exports = {
    DBPATH: process.env.MONGODB_URI? process.env.MONGODB_URI+'/agate-db':'mongodb://localhost:27017/agate-db',
    JWT_SECRET: 'growing-habbit',
    REGEX : {
        USERNAME : /^(?=.{5,20}$)[A-Za-z0-9]+(?:[_.][A-Za-z0-9]+)*$/, // 4-20, a-zA-Z0-9._, no._start or end, no consecutive ._
        PW : /^(?=.*[A-Za-z])(?=.*0-9)[A-Za-z0-9]{4,20}$/  // 4-20 a-zA-Z0-9 one letter one number
    },
    ACCESSIBLE : [
        '/login',
        '/habits', 
        {url: '/users', methods: 'POST'}
    ]
};