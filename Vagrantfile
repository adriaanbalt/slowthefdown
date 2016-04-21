# -*- mode: ruby -*-
# vi: set ft=ruby :

project_name = "slowthefdown"
node_version = "4.3.1"
npm_version = "3.7.1"

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.boot_timeout = 600
  config.vm.synced_folder ".", "/home/vagrant/#{project_name}",
    type: "rsync",
    rsync__args: ["--verbose", "--archive", "--delete", "-z", "--copy-links", "--inplace"],
    rsync__exclude: [".git/", ".sass-cache/", "node_modules/", "public/", "app/assets/stylesheets/generated/", "npm-debug.log"]

  config.vm.define "#{project_name}"
  config.vm.provider "virtualbox" do |v|
    v.name = project_name
    v.memory = 2048
    v.cpus = 1

    # Resolves DNS bug with /etc/resolv.conf
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "off"]
    v.customize ["modifyvm", :id, "--natdnsproxy1", "off"]
    v.customize ["modifyvm", :id, "--nictype1", "Am79C973"]
  end

  config.vm.provision "fix-no-tty", type: "shell" do |s|
    s.privileged = false
    s.inline = "sudo sed -i '/tty/!s/mesg n/tty -s \\&\\& mesg n/' /root/.profile"
  end

  config.vm.provision "docker" do |d|
    d.pull_images "slowthefdown/node-compass-image"
  end

  config.vm.provision :shell, inline: "echo 'cd /home/vagrant/#{project_name}' >> /home/vagrant/.profile"
  config.vm.provision :shell, path: "scripts/provision.sh",  privileged: true
  config.vm.provision :shell, path: "scripts/nvm.sh", args: [node_version, npm_version], privileged: false
  config.vm.provision :shell, path: "scripts/postinstall.sh", privileged: false
end
