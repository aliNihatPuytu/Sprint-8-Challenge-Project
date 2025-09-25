describe('Teknolojik Yemekler Pizza Sipariş Testleri', () => {

  const testData = {
    validName: 'Ahmet Yılmaz',
    shortName: 'Ah',
    pizzaSize: 'Orta',
    doughType: 'Normal Hamur',
    basePrice: 85.5,
    toppingPrice: 5
  };

  const fillMandatoryFields = () => {
    cy.get('input[name="name"]').clear().type(testData.validName);
    cy.contains(testData.pizzaSize).click();
    cy.contains(testData.doughType).click();
  };

  const selectToppings = (count) => {
    for (let i = 0; i < count; i++) {
      cy.get('input[type="checkbox"]').eq(i).check({ force: true });
    }
  };

  const mockSuccessResponse = {
    statusCode: 201,
    body: {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }
  };

  const mockErrorResponse = {
    statusCode: 500,
    body: { error: 'Sunucu hatası' }
  };

  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.viewport(1280, 720);
  });

  describe('Ana Sayfa Testleri', () => {
    it('Ana sayfa başlık ve slogan görüntülenmeli', () => {
      cy.get('h1').should('contain', 'Teknolojik Yemekler');
      cy.contains('KOD ACIKTIRIR PIZZA, DOYURUR').should('be.visible');
    });

    it('Sipariş butonu görünür ve aktif olmalı', () => {
      cy.contains('ACIKTIM')
        .should('be.visible')
        .and('not.be.disabled')
        .and('have.css', 'cursor', 'pointer');
    });

    it('Header bileşeni doğru render edilmeli', () => {
      cy.get('header').should('exist');
      cy.get('nav').should('be.visible');
      cy.get('img[alt*="logo"]').should('be.visible');
    });
  });

  describe('Navigasyon Testleri', () => {
    it('Sipariş butonu form sayfasına yönlendirmeli', () => {
      cy.contains('ACIKTIM').click();
      cy.url().should('include', '/pizza');
      cy.contains('Sipariş Oluştur').should('be.visible');
    });

    it('Geri butonu ana sayfaya yönlendirmeli', () => {
      cy.contains('ACIKTIM').click();
      cy.get('button').contains('Geri').click();
      cy.url().should('eq', 'http://localhost:5173/');
    });
  });

  describe('Form Validasyon Testleri', () => {
    beforeEach(() => {
      cy.contains('ACIKTIM').click();
    });

    describe('İsim Validasyonu', () => {
      it('İsim alanı minimum 3 karakter olmalı', () => {
        cy.get('input[name="name"]')
          .type(testData.shortName)
          .blur();
        
        cy.contains('İsim en az 3 karakter olmalıdır')
          .should('be.visible')
          .and('have.class', 'error');
      });

      it('Geçerli isimde hata mesajı görünmemeli', () => {
        cy.get('input[name="name"]')
          .type(testData.validName)
          .blur();
        
        cy.contains('İsim en az 3 karakter olmalıdır').should('not.exist');
      });

      it('İsim alanı zorunlu olmalı', () => {
        cy.get('input[name="name"]').focus().blur();
        cy.contains('İsim gereklidir').should('be.visible');
      });
    });

    describe('Pizza Boyut Validasyonu', () => {
      it('Pizza boyutu seçilmezse hata gösterilmeli', () => {
        fillMandatoryFields();
        cy.get('button[type="submit"]').click();
        cy.contains('Pizza boyutu seçilmelidir').should('be.visible');
      });

      it('Tüm boyut seçenekleri görünür olmalı', () => {
        ['Küçük', 'Orta', 'Büyük'].forEach(size => {
          cy.contains(size).should('be.visible');
        });
      });
    });

    describe('Hamur Kalınlığı Validasyonu', () => {
      it('Hamur kalınlığı seçilmezse hata gösterilmeli', () => {
        fillMandatoryFields();
        cy.get('button[type="submit"]').click();
        cy.contains('Hamur kalınlığı seçilmelidir').should('be.visible');
      });
    });

    describe('Malzeme Seçim Validasyonu', () => {
      it('Minimum 4 malzeme seçilmeli', () => {
        fillMandatoryFields();
        selectToppings(3);
        cy.get('button[type="submit"]').click();
        cy.contains('En az 4 malzeme seçmelisiniz').should('be.visible');
      });

      it('Maksimum 10 malzeme seçilebilmeli', () => {
        fillMandatoryFields();
        selectToppings(11);
        cy.contains('En fazla 10 malzeme seçebilirsiniz').should('be.visible');
        
        cy.get('input[type="checkbox"]:checked').should('have.length', 10);
      });

      it('4-10 malzeme arasında hata olmamalı', () => {
        fillMandatoryFields();
        selectToppings(6);
        cy.contains('En az 4 malzeme seçmelisiniz').should('not.exist');
        cy.contains('En fazla 10 malzeme seçebilirsiniz').should('not.exist');
      });
    });
  });

  describe('Fiyat Hesaplama Testleri', () => {
    beforeEach(() => {
      cy.contains('ACIKTIM').click();
      fillMandatoryFields();
    });

    it('Temel fiyat doğru hesaplanmalı', () => {
      cy.contains(`${testData.basePrice} ₺`).should('be.visible');
    });

    it('Malzeme ekledikçe fiyat artmalı', () => {
      const toppingCount = 4;
      selectToppings(toppingCount);
      
      const expectedPrice = testData.basePrice + (toppingCount * testData.toppingPrice);
      cy.contains(`${expectedPrice.toFixed(2)} ₺`).should('be.visible');
    });

    it('Malzeme çıkarıldığında fiyat azalmalı', () => {
      selectToppings(5);
      cy.get('input[type="checkbox"]:checked').first().uncheck();
      
      const expectedPrice = testData.basePrice + (4 * testData.toppingPrice);
      cy.contains(`${expectedPrice.toFixed(2)} ₺`).should('be.visible');
    });

    it('Boyut değiştiğinde fiyat güncellenmeli', () => {
      selectToppings(4);
      cy.contains('Büyük').click();
      
      cy.get('[data-testid="total-price"]')
        .invoke('text')
        .then(priceText => {
          const price = parseFloat(priceText.replace(' ₺', ''));
          expect(price).to.be.greaterThan(testData.basePrice + 20);
        });
    });
  });

  describe('Sipariş Gönderim Testleri', () => {
    beforeEach(() => {
      cy.contains('ACIKTIM').click();
      fillMandatoryFields();
      selectToppings(4);
    });

    it('Başarılı sipariş sonrası tebrik mesajı gösterilmeli', () => {
      cy.intercept('POST', 'https://reqres.in/api/pizza', mockSuccessResponse).as('successOrder');
      
      cy.get('button[type="submit"]').click();
      
      cy.wait('@successOrder').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
      });
      
      cy.contains('TEBRİKLER!').should('be.visible');
      cy.contains('SİPARİŞİNİZ ALINDI!').should('be.visible');
      cy.get('button').contains('Ana Sayfaya Dön').should('be.visible');
    });

    it('API hatası durumunda kullanıcıya bilgi verilmeli', () => {
      cy.intercept('POST', 'https://reqres.in/api/pizza', mockErrorResponse).as('errorOrder');
      
      cy.get('button[type="submit"]').click();
      
      cy.wait('@errorOrder');
      cy.contains('Sunucuya bağlanılamıyor').should('be.visible');
      cy.contains('Lütfen daha sonra tekrar deneyiniz').should('be.visible');
    });

    it('Network hatası durumunda hata yönetimi çalışmalı', () => {
      cy.intercept('POST', 'https://reqres.in/api/pizza', {
        forceNetworkError: true
      }).as('networkError');
      
      cy.get('button[type="submit"]').click();
      cy.contains('Network hatası oluştu').should('be.visible');
    });

    it('Sipariş gönderilirken loading state çalışmalı', () => {
      cy.intercept('POST', 'https://reqres.in/api/pizza', {
        delay: 1000,
        ...mockSuccessResponse
      }).as('delayedOrder');
      
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should('be.disabled');
      cy.contains('Sipariş Gönderiliyor...').should('be.visible');
    });
  });

  describe('Kullanıcı Deneyimi Testleri', () => {
    it('Form öğeleri focus durumunda doğru stil almalı', () => {
      cy.contains('ACIKTIM').click();
      
      cy.get('input[name="name"]').focus();
      cy.get('input[name="name"]').should('have.focus');
      
      cy.get('input[type="checkbox"]').first().focus();
      cy.get('input[type="checkbox"]').first().should('have.focus');
    });

    it('Malzeme seçiminde görsel feedback olmalı', () => {
      cy.contains('ACIKTIM').click();
      
      cy.get('input[type="checkbox"]').first().check({ force: true });
      cy.get('input[type="checkbox"]').first().should('be.checked');
      
      cy.get('input[type="checkbox"]').first().parent()
        .should('have.css', 'border-color')
        .and('not.eq', 'transparent');
    });

    it('Responsive tasarım testi', () => {
      cy.viewport('iphone-6');
      cy.contains('ACIKTIM').should('be.visible').click();
      
      cy.get('form').should('be.visible');
      cy.get('input[name="name"]').should('be.visible');
      
      cy.get('input[name="name"]').invoke('outerWidth')
        .should('be.lessThan', 400);
    });

    it('Form reset işlemi çalışmalı', () => {
      cy.contains('ACIKTIM').click();
      
      fillMandatoryFields();
      selectToppings(5);
      
      cy.contains('Geri').click();
      cy.contains('ACIKTIM').click();
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[type="checkbox"]:checked').should('have.length', 0);
    });
  });

  describe('Erişilebilirlik Testleri', () => {
    it('Form elementleri erişilebilir olmalı', () => {
      cy.contains('ACIKTIM').click();
      
      cy.get('input[name="name"]').should('have.attr', 'aria-required', 'true');
      cy.get('fieldset').should('have.attr', 'aria-labelledby');
      cy.get('button[type="submit"]').should('have.attr', 'type', 'submit');
    });

    it('Hata mesajları screen reader için uygun olmalı', () => {
      cy.contains('ACIKTIM').click();
      
      cy.get('input[name="name"]').focus().blur();
      cy.get('[role="alert"]').should('contain', 'İsim gereklidir');
    });

    it('Keyboard navigasyonu çalışmalı', () => {
      cy.contains('ACIKTIM').click();
      
      cy.get('body').tab();
      cy.focused().should('have.attr', 'name', 'name');
      
      cy.focused().tab();
    });
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });
});