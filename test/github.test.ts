import {test} from "vitest";

test("get public repos", async () => {
    let username = "yanmin41295"
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data)
})

test("get private repos", async () => {
    const response = await fetch(`https://api.github.com/user/repos?type=private`, {
        headers: {
            "Authorization": `Bearer ${process.env.github_token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data)
})