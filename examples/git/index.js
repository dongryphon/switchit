const {
    Container,
    Help
} = require('../../index.js');

const Commit = require('./commit');
const Fetch = require('./fetch');
const Pull = require('./pull');
const Remote = require('./remote');

class Git extends Container {
    //
}

Git.define({
    title: 'git',
    help: 'the stupid content tracker',
    commands: {
        '?': 'help',

        help: Help,
        commit: Commit,
        fetch: {
            type: Fetch
        },
        pull: {
            type: Pull
        },
        remote: Remote
    }
});

module.exports = Git;