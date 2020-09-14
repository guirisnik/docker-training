# Exercícios
Se quiser praticar com outros exercícios além dos que eu já coloquei aqui, existe uma [plataforma da KodeKloud](https://www.kodekloud.com/p/docker-labs) com quizzes em que você pode testar ideias e aprender um pouco mais sobre Docker

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
    - `run`
      - Algumas opções do comando `run`
    - `ps`
    - `stop`
    - `rm`
    - `images`
    - `rmi`
    - `pull`
  - Volumes
    - Como criar um volume
    - Como vincular um volume a um container
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
docker run nginx:latest
```

Na primeira vez que fizer isso, provavelmente você não terá a imagem do `nginx` no seu computador, então o Docker vai te responder que não conseguiu localizar a imagem que foi requisitada, mas que irá baixá-la da biblioteca. 

Além disso, note que adicionamos `:latest` ao nome da imagem. Isso é uma `tag`, que identifica a versão da imagem que queremos usar para executar nosso container. Por padrão, a imagem mais recente é utilizada, então você pode omitir a `tag` que o Docker irá auto completar para `:latest`.

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

Se quiser testar o servidor, por padrão, a porta que é exposta é a `8080`, então acessando [http://localhost:8080](http://localhost:8080) você deve ver a página padrão dele.

Se quiser expor uma porta diferente, use a opção `-p` quando executar o container. Por exemplo, se quisermos conectar a porta 5000 do nosso pc ao servidor nginx, usaríamos o comando

```bash
docker run -p 5000:80 nginx
```

Note que dessa vez não especificamos a `tag`, já que, como mencionado anteriormente, o Docker auto completa isso para nós com `:latest`.

Bem, agora, para testar o servidor, a porta vinculada é a 5000, então para acessar o servidor devemos acessar o endereço [http://localhost:5000](http://localhost:5000).

> Gui, por que você diz _executar_ um container?

```
[INFO]

Diferente de uma máquina virtual que normalmente dizemos _subir_ uma máquina virtual, que seria o equivalente a ligar um computador, um container não possui o mesmo ciclo de vida.

Containers não foram feitos para permanecerem ativos o tempo inteiro como é o caso de um sistema operacional, mas sim para _executar_ uma determinada tarefa, como hospedar um servidor para um site ou um banco de dados. Uma vez que esta tarefa ou _processo_ termina sua execução, então o container também termina sua execução.
```

#### Algumas opções do comando `run`
- `-d` : Executa o container no background e não trava o terminal;
- `-e` : Especifica uma variável de ambiente a ser adicionada ao container no padrão `VARIAVEL`=`valor`;
- `-i` : Executa o container em modo interativo;
- `-t` : Vincula o terminal do container à sua máquina;
- `-it` : Executa o container em modo interativo com o terminal vinculado;
- `-p` : Vincula uma porta do seu pc com uma porta do container no padrão `porta-do-seu-pc`:`porta-do-container`;
- `--rm` : Remove o container automaticamente quando o processo termina;
- `-v` : Vincula um _volume_ ao container.


### `ps`

Sem terminar a execução do container que instanciamos na seção anterior, vamos utilizar o comando

```bash
docker ps
```

que irá nos mostrar a lista de containers em execução naquele momento. Você deve ver algo parecido com isso aqui

```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
68de78444e12        nginx               "/docker-entrypoint.…"   About an hour ago   Up About an hour    80/tcp              jolly_herschel
```

Para ver a lista de todos os containers, incluindo aqueles que não estão sendo executados no momento, inclua a opção `-a` no comando, assim:

```bash
docker ps -a
```

### `stop`

O comando `stop` é utilizado para interromper a execução de um container dado especificado por um `ID` ou pelo nome, ambos os quais podem ser obtidos pelo comando `docker ps`.

Assim, no meu caso, de acordo com o retorno do comando eu deveria usar

```bash
docker stop jolly_herschel
# ou
docker stop 68
```

Nesse caso o `ID` não precisa ser informado na íntegra que o Docker já consegue identificar a qual container o comando se refere.

Note que quando usamos o comando `stop` não estamos deletando o container, apenas interrompendo sua execução, o que significa que se utilizarmos o comando `ps` com a opção `-a`, devemos ver o container na lista com o status `Exited`.

> Mas Gui, e se eu quiser remover esse container?

### `rm`

Para isso utilizamos o comando `rm`

```bash
docker rm jolly_herschel
```

Porém, isso remove apenas o container, que, como já vimos, é uma instância de uma imagem. E se quiséssemos remover a imagem? Ou mesmo obter uma lista das imagens disponíveis?

### `images`

Para ver a lista de imagens disponíveis localmente basta usar

```bash
docker images
```

e você deve ver algo parecido isso

```bash
REPOSITORY                                  TAG                 IMAGE ID            CREATED             SIZE
nginx                                       latest              4bb46517cac3        3 weeks ago         133MB
docker/whalesay                             latest              6b362a9f73eb        5 years ago         247MB

```

### `rmi`

Para remover uma imagem, da mesma forma como vimos para containers, devemos usar o comando `rmi`. Por exemplo, para remover a imagem do servidor `nginx` que baixamos, basta usar o comando

```bash
docker rmi nginx
```
---
**Importante**

Para conseguir remover uma imagem é precisa garantir que nenhum container que use aquela imagem exista!
---

### `pull`

Quando vimos o comando `run`, a imagem do servidor `nginx` foi baixada automaticamente, já que ela não existia ainda no computador. Porém, se quiséssemos apenas baixar a imagem sem executá-la, usaríamos o comando `pull`

```bash
docker pull nginx
```

---
---

## Gerenciar Dados
Por padrão, containers são processos sem persistência de dados. Isso significa que qualquer alteração feita nos arquivos dentro de um container não é mantida entre execuções.

Porém, existem algumas formas de gerar persistência de dados, sendo as mais comuns usando _volumes_ ou _bind mounts_, que são entidades independentes do container para armazenar dados sobre o que acontece dentro de um container.

A principal diferença entre _volumes_ e _bind mounts_ é que o primeiro é gerenciado pela aplicação do Docker, como se fosse um banco de dados; já o segundo é literalmente a especificação de um local na sua máquina para onde os arquivos serão destinados.

Algumas vantagens do uso de volumes/bind mounts:
- Quer excluir um container? À vontade, seus dados estarão salvos no volume associado.
- Quer migrar um container? Simples, apenas leve o volume para o novo local e a imagem do container associado.
- Quer compartilhar um volume entre vários containers? Fácil, apenas associe o mesmo volume quando executar os diferentes containers.

### Bind mounts
Como já mencionado, _bind mounts_ são apenas locais na sua máquina que servirão para armazenar arquivos utilizados pelo container.

A maneira de associar um _bind mount_ a um container é com a opção `--mount`. Por exemplo:

```bash
mkdir minha-pasta-favorita

docker run -it \
--mount type=bind,source="$(pwd)"/minha-pasta-favorita,target=/home \
ubuntu:latest
```

> Obs.: `pwd` é uma função em bash que significa `print working directory`, utilizada para abreviar o caminho até o diretório em que se está trabalhando naquele momento no terminal.

O que o comando acima irá fazer é executar um container com a imagem do `Ubuntu` (a tag `latest` significa que estamos utilizando a versão mais atual disponível) em modo interativo (opção `-it`) e estamos _montando_ um vínculo entre uma pasta chamada `minha-pasta-favorita` e a pasta de destino dentro do container `home`.

Para testar o vínculo, podemos criar um arquivo qualquer (tanto dentro do container como fora dele, tanto faz) e verificar que o arquivo irá aparecer em ambas as pastas. Por exemplo:

```bash
cd minha-pasta-favorita && touch meu-arquivo-favorito
```

Executando o comando acima você irá criar um arquivo dentro de `minha-pasta-favorita` chamado `meu-arquivo-favorito`. Agora dentro do container, olhando para a pasta `home`, você deverá ver que existe lá também uma cópia do `meu-arquivo-favorito`.

```bash
cd /home
ll
```

A saída do comando acima deve ser algo parecido com isso:

```bash
drwxr-xr-x 2 1000 1000 4096 Sep 11 19:53 ./
drwxr-xr-x 1 root root 4096 Sep 11 19:48 ../
-rw-r--r-- 1 1000 1000    0 Sep 11 19:53 meu-arquivo-favorito
```

---
---
### Volumes
Para utilizar volumes é preciso primeiro criar um, o que é feito utilizando o comando

```bash
docker volume create nome-do-seu-volume
```

e, para vincular o volume a um container, basta utilizar a opção `-v` ou `--volume`

```bash
docker run -it \
--volume nome-do-seu-volume:/home \
ubuntu:latest
```

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