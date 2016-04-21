module.exports = (searchVal) => searchVal === 'nosearch' ? {
    // exclude null names
    $where: 'this.name !== undefined'
} : {
    // search for string in project name,  users' full names, and lastUpdatedDate
    $where: `this.name !== undefined && (this.name.toLowerCase() + '  ' + (!this.users? '' : !this.users.userFullNames? '' : this.users.userFullNames.join('  ').toLowerCase()) + '  ' + ((this.lastUpdatedDate.getMonth()+1).toString() + "/" + this.lastUpdatedDate.getDate() + "/" + this.lastUpdatedDate.getFullYear().toString().slice(2))).indexOf("${searchVal}") !== -1`
};
