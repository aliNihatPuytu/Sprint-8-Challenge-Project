describe('Teknolojik Yemekler Pizza Sipariş Testleri', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('Ana sayfa elementleri yüklenmeli', () => {
    cy.contains('KOD ACIKTIRIR PIZZA, DOYURUR');
    cy.contains('ACIKTIM').should('be.visible').and('not.be.disabled');
  });

  it('Sipariş formuna yönlendirme çalışmalı', () => {
    cy.contains('ACIKTIM').click();
    cy.contains('Sipariş Oluştur').should('be.visible');
    cy.contains('Position Absolute Acı Pizza').should('be.visible');
  });

  it('İsim validasyonu çalışmalı', () => {
    cy.contains('ACIKTIM').click();
    
    cy.get('input[name="name"]').type('Ah');
    cy.get('input[name="name"]').blur();
    cy.contains('İsim en az 3 karakter olmalıdır').should('be.visible');
    
    cy.get('input[name="name"]').clear().type('Ahmet Yılmaz');
    cy.contains('İsim en az 3 karakter olmalıdır').should('not.exist');
  });

  it('Pizza boyut ve hamur seçimi zorunlu olmalı', () => {
    cy.contains('ACIKTIM').click();
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz');
    
    cy.get('button[type="submit"]').click();
    
    cy.contains('Pizza boyutu seçilmelidir').should('be.visible');
    cy.contains('Hamur kalınlığı seçilmelidir').should('be.visible');
    cy.contains('En az 4 malzeme seçmelisiniz').should('be.visible');
  });

  it('Malzeme seçim sınırlaması çalışmalı', () => {
    cy.contains('ACIKTIM').click();
    
    for (let i = 0; i < 11; i++) {
      cy.get('input[type="checkbox"]').eq(i).check({ force: true });
    }
    
    cy.contains('En fazla 10 malzeme seçebilirsiniz').should('be.visible');
    
    cy.get('input[type="checkbox"]').first().uncheck();
    
    cy.contains('En fazla 10 malzeme seçebilirsiniz').should('not.exist');
  });

  it('Fiyat hesaplama doğru çalışmalı', () => {
    cy.contains('ACIKTIM').click();
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz');
    
    cy.contains('Orta').click();
    
    cy.contains('Normal Hamur').click();
    
    for (let i = 0; i < 4; i++) {
      cy.get('input[type="checkbox"]').eq(i).check();
    }
    
    cy.contains('105.50 ₺').should('be.visible');
  });

  it('Başarılı sipariş gönderimi çalışmalı', () => {
    cy.contains('ACIKTIM').click();
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz');
    cy.contains('Orta').click();
    cy.contains('Normal Hamur').click();
    
    for (let i = 0; i < 4; i++) {
      cy.get('input[type="checkbox"]').eq(i).check();
    }
    
    cy.intercept('POST', 'https://reqres.in/api/pizza', {
      statusCode: 201,
      body: {
        id: '12345',
        createdAt: new Date().toISOString()
      }
    }).as('pizzaOrder');
    
    cy.get('button[type="submit"]').click();
    
    cy.contains('TEBRİKLER!').should('be.visible');
    cy.contains('SİPARİŞİNİZ ALINDI!').should('be.visible');
  });

  it('API hatası durumunda hata gösterilmeli', () => {
    cy.contains('ACIKTIM').click();
    
    cy.get('input[name="name"]').type('Ahmet Yılmaz');
    cy.contains('Orta').click();
    cy.contains('Normal Hamur').click();
    
    for (let i = 0; i < 4; i++) {
      cy.get('input[type="checkbox"]').eq(i).check();
    }
    
    cy.intercept('POST', 'https://reqres.in/api/pizza', {
      statusCode: 500,
      body: { error: 'Sunucu hatası' }
    }).as('pizzaOrderError');
    
    cy.get('button[type="submit"]').click();
    
    cy.contains('Sunucuya bağlanılamıyor').should('be.visible');
  });
});