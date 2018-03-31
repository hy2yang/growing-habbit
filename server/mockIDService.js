let id=1;
const active= new Set();

function getID(){
    const res = {currentId:id};
    active.add(id);
    id = id%3+1;
    return res;
}

module.exports={
    getID : getID,
    activeUsers : active
};