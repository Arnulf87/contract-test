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
        
        const rightName = "MyTestToken"
        expect(await MTT.name()).to.eq(rightName);
    });

    it("Should have right symbol", async function() {
        const { MTT } = await loadFixture(deployMTT);
        
        const rightSymbol = "MTT"
        expect(await MTT.symbol()).to.eq(rightSymbol);
    });

    it("Should have right totalSupply", async function() {
        const { MTT } = await loadFixture(deployMTT);

        expect(await MTT.totalSupply()).to.eq(2100000);
    });
   
    it("Should have right decimals", async function() {
        const { MTT } = await loadFixture(deployMTT);
        
        expect(await MTT.decimals()).to.eq(2);     
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
            const { user2, owner, MTT } = await loadFixture(deployMTT);

            const supply = 2100000;
            expect(await MTT.balanceOf(owner)).to.equal(supply);
        });
    });
    /*
    //  HardhatError: HH17: The input value cannot be normalized to a BigInt: Unsupported type function

    it('BalanceOf: returns the total token value when the requested account has some tokens', async function () {
        const { owner, MTT } = await loadFixture(deployMTT);

        const result = expect(await MTT.balanceOf(owner)).to.equal(MTT.totalSupply);

        console.log(result);
    });
    */
    
    describe("Transfer", function() {
        
        it("Should be move some tokens on another account", async function () {
            const { owner, user2, MTT } = await loadFixture(deployMTT);
            
            const amount = 3000;
            const tx = await MTT.connect(owner).transfer(user2, amount);
            await tx.wait(1);

            expect(await MTT.balanceOf(user2)).to.eq(amount);
        });

        it("Should be emits a transfer event", async function () {
            const { owner, user2, MTT } = await loadFixture(deployMTT);
            
            const amount = 3000;
            const tx = await MTT.connect(owner).transfer(user2, amount);
            await tx.wait(1);
            
            const txData = await expect(tx).to.emit(MTT,'Transfer')
            .withArgs(owner.address, user2.address, amount);
            
            // ??? result undefined
            console.log(txData);
        });

        // ???  Error: VM Exception while processing transaction: reverted with reason string 'Wrong addres!'
        /*
        it("Should be a recipient address that is not equal to the zero address",
         async function () {
            const { owner, user2, MTT } = await loadFixture(deployMTT);
            
            const amount = 3000;
            const tx = await MTT.connect(owner).transfer(ethers.ZeroAddress, amount);
            await tx.wait(1);
            
            await expect(tx).to.be.revertedWith('Wrong addres!');
        });
        
        // ???  Error: VM Exception while processing transaction: 
        // reverted with reason string 'There are not enough tokens in the account!'
        it("Should be enough funds to send", async function () {
            const { user2, user3, MTT } = await loadFixture(deployMTT);
            
            const amount = 3000;
            const tx = await MTT.connect(user2).transfer(user3, amount);
            await tx.wait(1);
            
            await expect(tx).to.be.revertedWith("There are not enough tokens in the account!");
        });
        */
    });
});
});