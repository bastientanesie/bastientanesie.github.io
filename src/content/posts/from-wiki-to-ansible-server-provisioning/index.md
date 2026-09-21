---
title: "Ansible Killed My Wiki Procedure (And I Have No Regrets)"
description: "Tired of copy-pasting server setup procedures and hoping for the best? Here's how I replaced our internal wiki with Ansible — and why you should too."
publishedAt: 2026-03-18
aiAssisted: true
tags: ["ansible", "devops", "automation"]
---

Server provisioning from a wiki procedure is a lie we tell ourselves. It looks
like a process. It feels like a process. And then someone copy-pastes the wrong
line at 16:45 on a Friday and you end up wasting three hours trying to figure out
why the SSH connection isn't working.

## The Wiki Illusion

At [Wixiweb](https://www.wixiweb.fr/), we manage our own dedicated OVH servers.
Each client gets their own virtual machine via [Proxmox](https://www.proxmox.com/),
and we document everything in a self-hosted [Outline](https://www.getoutline.com/)
wiki. Step-by-step procedures, neatly written, kept (more or less) up to date.
On paper, it looks solid.

In practice, it's a recipe for quiet, invisible mistakes.

The problem with a procedure is that it requires the person following it to be
100% focused, 100% of the time. Miss a step, botch a copy-paste, misread a
config value — and nothing tells you. No error, no warning, no feedback. The
server comes up, looks fine, and you move on. The mistake just sits there,
dormant, waiting for the worst possible moment to surface. Sometimes it's you
who discovers it, by chance. More often, it's the client. And nothing kills your
credibility faster than a client reporting a problem that's been silently lurking
in a misconfigured `sshd_config` for three months.

## The Bash Script "Solution"

The natural next step was to automate the repetitive parts with a bash script.
Good intent, reasonable idea, bad outcome.

The script worked, alright — but it came with its own set of problems that got
worse over time:

- It uses some advanced bash syntax that maybe two people on the team were actually
  comfortable reading
- It's way less self-explanatory than the wiki procedure it's supposed to
  replace
- It gradually turned into a black box: everyone ran it, nobody fully understood
  it, and when something broke, nobody wanted to touch it

That last point is the real killer. To be fair, the script is actually
well-maintained — it's been running reliably for years, and whenever something
needed fixing, it got fixed fast. The problem isn't the script itself.
It's what the script does to the team.

When something just works, people stop trying to understand it. Nobody digs into
what the script actually does, nobody builds familiarity with the installation
process as a whole, and bash proficiency quietly stagnates. The procedure exists
in the wiki, the automation exists in the script, and the mental model of how they
relate to each other exists in the heads of maybe two people. Everyone else just
runs the thing and moves on. That's a fragile way to hold knowledge.
Not because the script will break — it probably won't — but because the day
you need to adapt it, debug an edge case, or onboard someone new, you realize
the understanding never spread beyond the people who wrote it.

## Why Ansible, Specifically

I'd been vaguely aware of [Ansible](https://www.ansible.com/) for years without
ever having a concrete reason to learn it. This felt like the concrete reason.

For the uninitiated: Ansible is an open-source automation tool that lets you
describe infrastructure state in YAML. You define _what_ you want — packages
installed, files deployed, services running — and Ansible figures out _how_ to
get there. No agent required on target machines, just SSH access and Python.
That last part matters: zero infrastructure to maintain just to run your
automation.

A few things pushed me toward Ansible over the alternatives:

**YAML is readable by non-specialists.** This was the dealbreaker in our
context. A sysadmin, a developer, even a curious project manager can read an
Ansible task and understand what it does. That alone solves the black-box
problem.

**Idempotency is built in.** Run the same playbook twice, get the same result.
Ansible [modules](https://docs.ansible.com/ansible/latest/collections/index_module.html)
check the current state before acting — if a package is already installed, it
skips it. If a config line already matches, it leaves it alone. This is the
behavior you _think_ your bash script has, but probably doesn't.

**It's structured by design.** Ansible has a concept of
[roles](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html)
— self-contained units that handle one concern (SSH config, PHP setup, Apache
vhosts). Each role has a predictable directory structure, its own tasks,
variables, and templates. It forces you to organize your automation in a way
that bash never will.

<!-- internal link suggestion: link to future article introducing Ansible concepts for developers -->

## From Procedure Steps to Ansible Roles

I took our internal provisioning procedure — seven steps, redacted for obvious
reasons — and mapped each one to an Ansible role:

| Procedure step                        | Ansible role |
| ------------------------------------- | ------------ |
| System dependencies & package updates | `common`     |
| System users                          | `users`      |
| SSH setup & config                    | `ssh`        |
| PHP setup & config                    | `php`        |
| MySQL setup & config                  | `mysql`      |
| Apache setup & config                 | `apache`     |
| Apache vhosts creation                | `vhosts`     |

The main playbook just calls them in sequence:

```yaml
# playbook.yml
- name: Provision web server
  hosts: new_server
  become: true
  roles:
    - common
    - users
    - ssh
    - php
    - mysql
    - apache
    - vhosts
```

The inventory points to the target VM:

```ini
# inventory/hosts.ini
[new_server]
192.168.1.50 ansible_user=root
```

That's it. `ansible-playbook -i inventory/hosts.ini playbook.yml` and you go
make a coffee (or a hot chocolate in my case).

### A Concrete Role: SSH

The SSH role is a good example of what makes Ansible pleasant to work with.
Here's a simplified version of what it does:

```yaml
# roles/ssh/tasks/main.yml

- name: Disable root login
  ansible.builtin.lineinfile:
    path: /etc/ssh/sshd_config
    regexp: "^#?PermitRootLogin"
    line: "PermitRootLogin no"
    state: present

- name: Disable password authentication
  ansible.builtin.lineinfile:
    path: /etc/ssh/sshd_config
    regexp: "^#?PasswordAuthentication"
    line: "PasswordAuthentication no"
    state: present

- name: Deploy authorized keys for system users
  ansible.posix.authorized_key:
    user: "{{ item.name }}"
    key: "{{ item.ssh_public_key }}"
    state: present
  loop: "{{ system_users }}"

- name: Restart SSH
  ansible.builtin.service:
    name: sshd
    state: restarted
```

The `system_users` variable comes from the role's `vars/main.yml` or the
playbook's group vars — a list of user objects defined once and reused across
roles that need it.

Compare this to the equivalent bash incantation with `sed`, and tell me which
one you'd rather hand to a junior dev to review. Or to your future self in six
months (been there, done that, wouldn't do it again).

The idempotency point is worth dwelling on here: run this role against a server
where root login is already disabled, and nothing happens. Run a bash script
that does the same thing carelessly, and you might end up with duplicate lines
in `sshd_config`. Ansible checks before it acts.

<!-- internal link suggestion: link to future article going deeper on Ansible roles and variables -->

### Variables and Secrets: Not an Afterthought

One question worth addressing head-on: if SSH public keys and passwords live in
variables, where do those variables actually go? And how do you avoid committing
a root password to your git repository?

Ansible has a layered variable system. Non-sensitive values live in plain YAML
files — `group_vars/all.yml` for things shared across all hosts, role-specific
`vars/main.yml` for defaults scoped to a role. For the `system_users` list used
in the SSH role, that might look like this:

```yaml
# group_vars/all.yml
system_users:
  - name: deploy
    ssh_public_key: "ssh-ed25519 AAAAC3Nz... deploy@wixiweb.fr"
  - name: bastien
    ssh_public_key: "ssh-ed25519 AAAAC3Nz... bastien@wixiweb.fr"
```

Public keys? Fine in plain text, that's literally their purpose. Passwords,
private tokens, database credentials? That's where
[Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html)
comes in.

Vault lets you encrypt any variable file with a password. The workflow is
straightforward:

```bash
# Encrypt a file containing sensitive variables
ansible-vault encrypt group_vars/secrets.yml

# Run a playbook that uses encrypted variables
ansible-playbook -i inventory/hosts.ini playbook.yml --ask-vault-pass
```

The encrypted file is committed to your repository as ciphertext, decrypted
on the fly at runtime. In practice, the split looks like this: one
`group_vars/all.yml` for public configuration, one `group_vars/secrets.yml`
encrypted with Vault for anything sensitive.

Which brings up the question I haven't fully solved yet: where does the Vault
password itself live? At Wixiweb, we currently store shared credentials in a
KeePass file. It works, but it has real limitations — handing the database
password to an intern so they can grab a single credential is the kind of thing
that makes you wince a little every time. You end up with all-or-nothing access
to everything, which isn't great.

The proper answer is a dedicated secrets manager with fine-grained access
control. [HashiCorp Vault](https://www.vaultproject.io/) is the obvious
reference, and there are self-hostable alternatives worth exploring.
I haven't gone deep on this yet, but it's the logical next step once the
Ansible adoption is further along. That'll probably be a separate article.

For now, Ansible Vault covers the basics and keeps plaintext secrets out of
the repository. It's not the full story, but it's a solid floor to start from.

## Honest Status Report

Here's where I have to be straight with you: this project has not gone to
production. I've been running it against internal test VMs, validating that
each role does what it's supposed to, but it hasn't provisioned a single
client server yet.

The technical side is frankly the easy part. The harder part is getting it
adopted internally.

Wixiweb is a place where new tooling moves at its own pace. I know this from
experience — getting the team to migrate from SVN to GitLab took roughly six
months of lobbying, demos, and patient convincing. Good tools don't sell
themselves. People have established habits, a working (enough) current process,
and a legitimate wariness of "someone's side project becoming the new standard."
All fair.

So rather than pitching a full server provisioning overhaul on day one, I'm
going to try a different approach first: pick a single software component,
automate its installation and configuration with Ansible, and get that in front
of the team as a concrete, low-risk demo. Smaller surface area, easier approval,
easier rollback if it goes sideways.

I'll write about how that goes — including the internal politics, because that
part of the job rarely gets talked about honestly.

<!-- internal link suggestion: link to future article about the internal adoption process -->

## What I'd Tell Past Me

Learning Ansible as a web developer who'd never touched infrastructure automation
felt mildly intimidating at first. It didn't need to be. The YAML syntax is
approachable, the
[official documentation](https://docs.ansible.com/ansible/latest/index.html)
is genuinely good, and the mental model — "describe the desired state, let the
tool get there" — clicks fast once you stop thinking in imperative scripts.

The real value isn't the automation itself. It's the shift from "follow these
steps and hope" to "define what correct looks like, then verify it." That's a
different relationship with your infrastructure, and a healthier one.

Whether Ansible specifically is right for your setup is a separate question.
But if you're still running server provisioning from a wiki procedure and a bash
script nobody wants to touch, something has to change. The wiki was never meant
to be executable code. Stop pretending it is.

I'm curious whether anyone else has gone through this kind of tooling transition
in a small team — and what the actual sticking point turned out to be. The
technical setup, or getting everyone else on board? Feel free to hit me on
[Bluesky](https://bsky.app/profile/bastien.tanesie.fr) about that.
