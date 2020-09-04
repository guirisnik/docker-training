# Objetivos

- Parte 1
  - Por que preciso disso?
  - O que são containers?
  - O que é Docker?
  - O que são imagens?
  - Container vs Virtual Machine
- Parte 2
  - Como instalar
  - Comandos
    - run
  - Como executar um container
  - Criar uma imagem personalizada
  - Redes em Docker
  - Docker Compose
- Parte 3
  - Conceitos avançados
  - Swarm
  - Kubernetes

# Parte 1
## Por que preciso disso?
Garantir que uma aplicação seja executada da forma como foi projetada independente do ambiente em que está sendo executada. Em outras palavras, a principal motivação em utilizar Docker está relacionado com gerenciamento de dependências e garantir que sua aplicação seja hospedada em um ambiente amigável para ela.

Por exemplo, digamos que você precisasse hospedar dois serviços, um web server que irá responder às requisições externas (API) e um banco de dados que irá armazenar os dados da sua aplicação. Neste exemplo, digamos ainda que as suas especificações de web server fazem com que seja necessário utilizar um sistema operacional X, enquanto que seu banco de dados necessita de outro sistema operacional Y para garantir seu bom funcionamento.

Assim, utilizando Docker, é possível criar containers distintos para cada um destes serviços e, dentro da mesma máquina (host) criar uma comunicação simples e segura entre ambos.

---
---

## O que são containers?
São ambientes isolados dentro do mesmo sistema operacional, cada um tendo seus próprios processos e redes, mas compartilhando do mesmo Kernel, provido pelo sistema operacional.

> Mas Gui, esse treco é novo? 

---
---

## O que é Docker?
Não, pessoa leitora! Containers existem há pelo menos 10 anos no mundo de tecnologia. A novidade é que esta empresa chamada Docker facilitou a criação e gerenciamento de containers usando uma linguagem com nível mais elevado, porque antigamente era muito complicado fazer esse tipo de trabalho, já que mexe com o Kernel do sistema operacional.

> Kernel é uma das camadas do sistema operacional responsável por orquestrar o que acontece entre o que o usuário aciona e como o hardware deve responder!

Note que, como os containers dependem e compartilham do Kernel, só é possível executar containers compatíveis com seu Kernel. O que isso significa é que se seu sistema é baseado no Kernel do Linux, então você só poderá hospedar containers que funcionem com Kernel Linux. Em outras palavras, não é possível executar um container Windows dentro de um sistema operacional Linux, uma vez que o Windows depende de outro Kernel.

---
---

## O que são imagens?
Em Docker existem componentes chamados de _imagens_ que funcionam como templates de containers.

> Mas Gui, qual a diferença disso pra um container?

A diferença é que um container é um representante de uma determinada imagem sendo executada. Assim, é possível ter vários containers sendo executados que utilizam a mesma imagem como base.

O mais legal de tudo é que você pode compor suas próprias imagens colocando dentro delas a sua aplicação e até mesmo outras imagens disponibilizadas por outros usuários do Docker.

Esse é o recurso do Docker que faz com que sua aplicação seja sempre executada da mesma forma independente de onde ela for colocada. Em outras palavras, a imagem é um template do mesmo ambiente em que sua aplicação foi desenvolvida, para que você consiga exportar o mesmo ambiente da sua máquina para o ambiente de hospedagem da aplicação.

No [docker hub](https://hub.docker.com/) existem diversas imagens disponíveis que você pode baixar para usar ou compor seus projetos. Existem imagens do Ubuntu, Python, Node, NGinx, Apache, ... enfim, uma infinidade.

---
---

## Container vs Virtual Machine
Uma máquina virtual representa uma instância completa do sistema operacional com seu próprio Kernel, compartilhando apenas o hardware com o sistema operacional nativo.

Já um container é representado simplesmente por um processo, como se fosse mais um software aberto dentro do sistema operacional e compartilhando o mesmo Kernel.

Essa diferença significa que um container é muito mais leve (ordem de MB, enquanto que uma máquina virtual está na ordem de GB) e leva menos tempo para iniciar (boot time).

> Gui, isso significa que containers são _melhores_ que máquinas virtuais?

Não! De forma alguma. O que eu gostaria de convencer aqui é que, por serem diferentes, possuem nichos de aplicação diferentes.

Inclusive, é extremamente comum encontrar arquiteturas que utilizem containers dentro de máquinas virtuais, uma vez que é possível executar tanto sistemas Windows como sistemas Linux em paralelo usando máquinas virtuais. A questão é que máquinas virtuais são ambientes isolados, enquanto que containers dentro do mesmo sistema operacional conseguem estabelecer comunicação de forma fácil e segura.

---

# Parte 2

## Como instalar

Vamos instalar a _Community Edition_. Aqui vou cobrir apenas a instalação em ambientes Linux, especificamente para Ubuntu, mas, se tiver interesse em instalar para Windows, pode verificar a [documentação oficial](https://docs.docker.com/docker-for-windows/install/).

Caso queira olhar a documentação para Ubuntu, pode [clicar aqui](https://docs.docker.com/engine/install/ubuntu/).

A primeira coisa a se fazer é certificar de que não tenham versões antigas do Docker instaladas. Essa parte é importante porque as aplicações mudaram de nome ao longo do tempo.

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

É provável que o `apt-get` reporte que nenhum desses pacotes esteja instalado no seu sistema, mas, por precaução, é melhor executar o comando.

### Docker Engine

A aplicação que iremos instalar é o `Docker Engine`, que é um servidor responsável por gerenciar e construir os containers. Para isso, é necessário instalar alguns programas antes que irão nos auxiliar nesse processo.

Essas aplicações irão permitir que usemos o repositório de instalação do `Docker Engine` usando o protocolo `HTTPS`

```bash
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

Em seguida, precisamos fazer o download e adicionar uma chave chamada de GPG (GNU Privacy Guard), que é como se fosse uma chave de API para instalar aplicações.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Para verificar se a chave foi adicionada com sucesso, execute o comando abaixo que irá procurar pela chave que acabamos de adicionar com o comando anterior

```bash
sudo apt-key fingerprint 0EBFCD88
```

A resposta esperada desse comando deve ser algo assim:

```bash
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]
```

Agora vamos adicionar o endereço do repositório da aplicação do `Docker Engine` ao nosso `apt-get`

```bash
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

E vamos atualizar nosso `apt-get` com o novo repositório que adicionamos

```bash
sudo apt-get update
```

Finalmente, vamos instalar o `Docker Engine` e o `containerd`

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Ao final da instalação, recomendo a execução deste comando

```bash
sudo usermod -aG docker $USER
```

Que vai fazer com que você não precise executar o docker como `superuser`, isto é, usando o `sudo`. Essa alteração só terá efeito se você relogar no sistema operacional!

Agora que você já chegou aqui, vou contar um segredo: existe uma maneira mais simples de instalar o docker usando um script feito pela própria empresa!

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

> Por que me fez ler tudo então, Risnik?

Pra você saber o que cada coisa faz, derp. :smile:

> Como vou saber se instalou tudo certo?

Para fazer um teste, tente executar o seguinte comando:

```bash
docker run docker/whalesay cowsay Splash Modafoca
```

---
---

## Comandos
Aqui vou passar uma lista dos comandos mais utilizados com Docker.
### `run`

O comando `run` é usado para executar um container a partir de uma imagem. Por exemplo, se quiséssemos executar uma instância de um servidor `nginx`, basta usar o comando

```bash
docker run nginx
```

Na primeira vez que fizer isso, provavelmente você não terá a imagem do `nginx` no seu computador, então o Docker vai te responder que não conseguiu localizar a imagem que foi requisitada, mas que irá baixá-la da biblioteca.

> Gui, que raio de biblioteca é essa?

Bem, o Docker possui um site especial para guardar as imagens na nuvem, como um GitHub especial para Docker. Esse site é chamado de [Docker Hub](https://hub.docker.com/). Lá você encontra diversas imagens disponíveis e pode até colocar suas próprias imagens (mais tarde veremos como montar uma imagem e colocá-la no `Docker Hub`).

Quando o download terminar, você deve ver algo no seu terminal parecido com isso aqui:

```bash
1bk234jb12kj3b: Pull complete
...
Digest: sha256: ...
Status: Downloaded newer image for nginx:latest
...
/docker-entrypoint.sh: Configuration complete; ready for start up
```

E verá que seu terminal agora está travado. Isso significa que o container está sendo executado.

### `ps`

Sem terminar a execução do container que instanciamos na seção anterior, vamos utilizar o comando

```bash
docker ps
```

que irá nos mostrar a lista de containers em execução naquele momento. Para ver a lista de todos os containers, incluindo aqueles que não estão sendo executados no momento, inclua a opção `-a` no comando, assim:

```bash
docker ps -a
```

### `stop`

O comando `stop` é utilizado para interromper a execução de um container dado especificado por um `ID` ou pelo nome, ambos os quais podem ser obtidos pelo comando `docker ps`.


---
---
## Como executar um container
---
---
## Criar uma imagem personalizada
---
---
## Redes em Docker
---
---
## Docker Compose
---
---
# Parte 3
## Conceitos avançados
---
---
## Swarm
---
---
## Kubernetes
---
---