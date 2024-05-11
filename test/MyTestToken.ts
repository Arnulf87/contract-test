import { loadFixture, ethers, expect } from "./Setup";

describe("Deploy", function() {
    async function deployMTT() {
        const [owner, user2, user3] = await ethers.getSigners();
        
        const Factory = await ethers.getContractFactory("MyTestToken", owner);
        const MTT = await Factory.deploy();
        
        await MTT.waitForDeployment();

        return { owner, user2, user3, MTT }
    };

    it("Should be deployed", async function() {
        const { MTT } = await loadFixture(deployMTT);
       
        expect(MTT.target).to.be.properAddress;
    });

    it("Should have 0 ethers on balance of contract", async function() {
        const { MTT } = await loadFixture(deployMTT);
        
        const balance = await ethers.provider.getBalance(MTT);
        
        expect(balance).to.eq(0);
    });

    it("Should have right name", async function() {
        const { MTT } = await loadFixture(deployMTT);
        
        const correctName = "MyTestToken"
        expect(await MTT.name()).to.eq(correctName);
    });

    it("Should have right symbol", async function() {
        const { MTT } = await loadFixture(deployMTT);
        
        const correctSymbol = "MTT"
        expect(await MTT.symbol()).to.eq(correctSymbol);
    });

    it("Should have right totalSupply", async function() {
        const { MTT } = await loadFixture(deployMTT);

        expect(await MTT.totalSupply()).to.eq(ethers.parseEther("21000"));
    });
   
    it("Should have right decimals", async function() {
        const { MTT } = await loadFixture(deployMTT);
        
        expect(await MTT.decimals()).to.eq(18);     
    });  

describe("Functions", function() {
    describe("BalanceOf", function() {
          
    // BalanceOf:
    // returns zero when the requested account has no tokens.

        it('Should be return zero', async function () {
            const { user3, MTT } = await loadFixture(deployMTT);

            expect(await MTT.balanceOf(user3)).to.equal(0);
        });
    
    // BalanceOf: 
    // returns the total token value when the requested account has some tokens.

        it('Should be return some tokens on account', async function () {
            const { owner, MTT } = await loadFixture(deployMTT);

            const supply = ethers.parseEther("21000");
            expect(await MTT.balanceOf(owner)).to.equal(supply);
        });
    });
    
    describe("Transfer", function() {
        
        it("Should be move some tokens on another account", async function () {
            const { owner, user2, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            const tx = await MTT.connect(owner).transfer(user2, amount);

            const result = expect(await MTT.balanceOf(user2), "balance of user2").to.eq(amount);
            //console.log(result);
        });

        it("Should emit a transfer event", async function () {
            const { owner, user2, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            const tx = MTT.connect(owner).transfer(user2, amount);
            
            await expect(tx, "emits transfer event").to.emit(MTT,'Transfer')
            .withArgs(owner.address, user2.address, amount);
        });

        it("Should be a recipient address that is not equal zero address",
         async function () {
            const { owner, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            const tx = MTT.connect(owner).transfer(ethers.ZeroAddress, amount);
            
            await expect(tx).to.be.revertedWith('Wrong addres!');
        });
    
        it("Should be enough funds to send", async function () {
            const { user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            const tx = MTT.connect(user2).transfer(user3, amount);

            await expect(tx).to.be.revertedWith("There are not enough tokens in the account!");
        });

        it("Should checked balances", async function () {
            const { owner, user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            await MTT.connect(owner).transfer(user2, amount);

            await expect(() => MTT.transfer(user2, amount))
            .to.changeTokenBalance(MTT, user2, amount);

            await expect(() => MTT.transfer(user2, amount))
            .to.changeTokenBalance(MTT, owner, -amount);
        });
    });

    describe("Approve", function() {

        it("Should emit a approve event", async function () {
            const { owner, user2, MTT } = await loadFixture(deployMTT);
            
            const token = 3;
            const tx = MTT.connect(owner).approve(user2, token);
            
            await expect(tx).to.emit(MTT,'Approval')
            .withArgs(owner.address, user2.address, token);
        });

        it("Should be a recipient address that is not equal zero address",
         async function () {
            const { owner, MTT } = await loadFixture(deployMTT);
            
            const token = 3;
            const tx = MTT.connect(owner).approve(ethers.ZeroAddress, token);
            
            await expect(tx).to.be.revertedWith('Wrong addres!');
         });

         it("Should be enough funds to send", async function () {
            const { user2, user3, MTT } = await loadFixture(deployMTT);
            
            const token = 3;
            const tx = MTT.connect(user2).approve(user3, token);

            await expect(tx).to.be.revertedWith("Not enough funds");
        });
    });

    describe("Allowance", function() {

        // Allowance:
        // returns zero when the requested account has not allowance.
        it('Should be return zero', async function () {
            const { user2, user3, MTT } = await loadFixture(deployMTT);

            const result = expect(await MTT.allowance(user2, user3), "Allowance is zero").to.eq(0);
            //console.log(result);
        });

        // Allowance:
        // returns the amount of token that the owner allowed to spend.
        it('Should be return some tokens on account', async function () {
            const { owner, user2, MTT } = await loadFixture(deployMTT);

            const token = 3;
            await MTT.connect(owner).approve(user2, token);
            
            const result = expect(await MTT.allowance(owner, user2), "Allowance amount").to.eq(token);
            //console.log(result);
        });
    });

    describe("TransferFrom", function() {

        it('Should be move some tokens from the owners account to the recipients account',
         async function () {
            const { owner, user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            const tx = await MTT.connect(owner).approve(user2, amount);
            await tx.wait(1);

            await MTT.connect(user2).transferFrom(owner, user3, amount);

            const result = expect(await MTT.balanceOf(user3), "Transferred amount").to.eq(amount);
            //console.log(result);
        });

        it('Should be allowed to spend this amount', async function () {
            const { owner, user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            const rqAmount = 5;
            await MTT.connect(owner).approve(user2, amount);
            
            const tx2 = MTT.connect(user2).transferFrom(owner, user3, rqAmount);

            await expect(tx2).to.be.revertedWith("You are not allowed to spend this amount of tokens!");
        });

        it('Should be enough funds on balance', async function () {
            const { owner, user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            await MTT.connect(owner).transfer(user2, amount);
            await MTT.connect(user2).approve(user3, amount);
            await MTT.connect(user2).transfer(owner, amount);

            const tx = MTT.connect(user3).transferFrom(user2, user3, amount);

            await expect(tx).to.be.revertedWith("Not enough funds!");
        });

        it("Should checked balances", async function () {
            const { owner, user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            await MTT.connect(owner).approve(user2, amount);
            
            const tx = await MTT.connect(user2).transferFrom(owner, user3, amount);
            
            await expect(tx).to.changeTokenBalance(MTT, user3, amount);
            await expect(tx).to.changeTokenBalance(MTT, owner, -amount);
        });

        it("Should be a recipient address that is not equal zero address",
         async function () {
            const { owner, user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3;
            await MTT.connect(owner).approve(user2, amount);
            
            const tx = MTT.connect(user2).transferFrom(owner, ethers.ZeroAddress, amount);
            
            await expect(tx).to.revertedWith("Wrong addres!");
        });
    });
});
});