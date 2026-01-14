#!/usr/bin/env node

const args = process.argv.slice(2);

async function readGitHubActivity(username) {
  const rsp = await fetch(`https://api.github.com/users/${username}/events`, {
    headers: {
      "User-Agent": "node.js",
    },
  });

  if (!rsp.ok) {
    if (rsp.status === 400) {
      console.log('User not found');
    }
  } else {
    const events = await rsp.json();
    return events;
  }
}

async function showGitHubActivity(events) {
  if (events.length === 0) {
    console.log('Ativity not found');
    return;
  }

  events.forEach(event => {
    let message;
    switch (event.type) {
      case 'PushEvent':
        message = `Pushed new commits to ${event.repo.name}`;
        break;
      case "IssuesEvent":
        message = `${event.payload.message.charAt(0).toUpperCase() + event.payload.message.slice(1)} an issue in ${event.repo.name}`;
        break;
      case "WatchEvent":
        message = `Starred ${event.repo.name}`;
        break;
      case "ForkEvent":
        message = `Forked ${event.repo.name}`;
        break;
      case 'CreateEvent':
        message = `Created a ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      case 'PublicEvent':
        message = `Made public ${event.repo.name}`;
        break;
      default:
        break;
    }
    if (message) console.log(`- ${message}`);
  });
}

if (args.length < 1) {
  console.error('vegitracker <username>');
} else {
  try {
    const username = args[0];
    const events = await readGitHubActivity(username);

    showGitHubActivity(events);
  } catch (error) {
    console.log(error);
  }
}